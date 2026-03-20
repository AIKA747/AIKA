package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.AppChatQueryVo
import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.bot.model.vo.resp.AppChatListVo
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.bot.service.BotMessageService
import com.parsec.aika.bot.service.BotService
import com.parsec.aika.bot.service.ChatService
import com.parsec.aika.bot.service.SttService
import com.parsec.aika.common.mapper.MessageRecordMapper
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.bo.ChatMsgRegenerateBO
import com.parsec.aika.common.model.bo.ReadMessageBO
import com.parsec.aika.common.model.bo.ResposeMessageBO
import com.parsec.aika.common.model.const.RedisConst
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.MsgStatus
import com.parsec.aika.common.model.em.SourceTypeEnum
import com.parsec.aika.common.model.entity.AssistantMsgRecord
import com.parsec.aika.common.model.entity.MessageRecord
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.annotation.Resource

@RefreshScope
@Service
class BotMessageServiceImpl : BotMessageService {

    @Resource
    private lateinit var botService: BotService

    @Resource
    private lateinit var chatService: ChatService

    @Resource
    private lateinit var sttService: SttService

    @Resource
    private lateinit var messageRecordMapper: MessageRecordMapper

    @Resource
    private lateinit var redisTemplate: RedisTemplate<String, Any>

    @Value("\${chat.history.length:20}")
    private val chatHistoryLength: Long = 20

    override fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        try {
            //获取用户聊天的消息体
            val chatMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ChatMessageBO::class.java)
            if (chatMessageBO.contentType == ContentType.TEXT) {
                Assert.notBlank(chatMessageBO.textContent, "The message content cannot be empty")
            }
            if (chatMessageBO.contentType == ContentType.VOICE) {
                Assert.notBlank(chatMessageBO.media, "Language message link cannot be empty")
                chatMessageBO.textContent = sttService.stt(chatMessageBO.media!!)
            }
            //构建用户消息
            val messageRecord = MessageRecord().apply {
                this.botId = chatMessageBO.objectId!!.toLong()
                this.userId = chatMessageBO.userId!!.toLong()
                this.contentType = chatMessageBO.contentType
                this.sourceType = SourceTypeEnum.user
                this.textContent = chatMessageBO.textContent
                this.media = chatMessageBO.media
                this.fileProperty = chatMessageBO.fileProperty
                this.msgStatus = MsgStatus.success
                this.readFlag = false
                this.creator = chatMessageBO.userId!!.toLong()
                this.createdAt = LocalDateTime.now()
                this.creatorName = baseMessageDTO.username
            }
            this.cacheMessageRecord(messageRecord)
            val messageRecords = this.getMessageRecords(messageRecord.botId!!, messageRecord.userId!!)
            if (chatMessageBO.digitHuman == true) {
                throw BusinessException("This robot does not support digital human mode")
//                if (null == bot.supportedModels || !bot.supportedModels!!.contains(SupportedModelEnum.DigitaHumanService.name)) {
//                    throw BusinessException("该机器人不支持数字人模式")
//                }
            }
            //非测试消息非数字人消息则保存消息内容到数据库
            if (!baseMessageDTO.test) {
                messageRecordMapper.insert(messageRecord)
            } else {
                messageRecord.id = System.currentTimeMillis()
            }
            //回复client已收到消息成功，开始处理
            chatService.respChatMsg(user, baseMessageDTO.successResp(messageRecord.id.toString()))
            //开始处理消息,异步，对于baseMessageDTO对象，使用json序列化实现深拷贝
            chatService.replyBotMessage(messageRecord, user, JSONUtil.toJsonStr(baseMessageDTO), messageRecords)
        } catch (e: BusinessException) {
            chatService.respChatMsg(user, baseMessageDTO.failResp("Failed to process chat message，${e.message}"))
        } catch (e: Exception) {
            chatService.respChatMsg(
                user, baseMessageDTO.failResp("Exception in handling chat messages, exception information:${e.message}")
            )
            StaticLog.error(e)
        }
    }

    private fun getMessageRecords(botId: Long, userId: Long): List<MessageRecord> {
        val redisKey = "${RedisConst.botMsgRecordListKey}:${botId}:${userId}"
        val list = redisTemplate.opsForList().range(redisKey, 0, chatHistoryLength)
        return list!!.map {
            JSONUtil.toBean(JSONObject(it), MessageRecord::class.java)
        }.distinctBy { it.id }.toList().reversed()
    }

    override fun cacheMessageRecord(messageRecord: MessageRecord) {
        //缓存消息到redis
        val redisKey = "${RedisConst.botMsgRecordListKey}:${messageRecord.botId}:${messageRecord.userId}"
        val opsForList = redisTemplate.opsForList()
        opsForList.leftPush(redisKey, JSONUtil.toJsonStr(messageRecord))
        opsForList.trim(redisKey, 0, chatHistoryLength - 1)
    }

    override fun handlerReadMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        if (!baseMessageDTO.test) {
            val readMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ReadMessageBO::class.java)
            val messageRecord = messageRecordMapper.selectById(readMessageBO.msgId)
            //数字人消息已读是查询不到记录的
            if (Objects.nonNull(messageRecord)) {
                messageRecord.readFlag = true
                messageRecord.readTime = readMessageBO.readAt
                messageRecordMapper.updateById(messageRecord)
                if (messageRecord.sourceType == SourceTypeEnum.bot) {
                    messageRecordMapper.update(
                        MessageRecord().apply {
                            msgStatus = MsgStatus.success
                        }, KtUpdateWrapper(MessageRecord::class.java).eq(
                            MessageRecord::id, messageRecord.replyMessageId
                        )
                    )
                }
            }
        }
        chatService.respChatMsg(user, baseMessageDTO.successResp(null))
    }

    override fun appChatList(queryVo: AppChatQueryVo, user: LoginUserInfo): PageResult<AppChatListVo> {
        // 会话的事实上是通过 subscription 和 message_record 的 inner join 来实现的。
        // （这里选用inner join 的目的在于，我们可以通过清除message_record的方法，来删除“会话”）
        // 机器人数据存在于机器人表里，而会话数，需要从message_record表中group
        PageHelper.startPage<AppChatListVo>(queryVo.pageNo!!, queryVo.pageSize!!)
        return PageUtil<AppChatListVo>().page(messageRecordMapper.appChatList(user.userId!!.toLong(), queryVo))
    }

    override fun deleteAppChatBotId(id: Long, user: LoginUserInfo) {
        // 根据botId和userId来删会话
        messageRecordMapper.appChatRecordDelete(user.userId!!, id)
    }

    override fun appChatRecords(queryVo: AppChatRecordQueryVo, user: LoginUserInfo): PageResult<AppChatRecordListVo> {
        Assert.notNull(queryVo.botId, "botId cannot be empty")
        PageHelper.startPage<AppChatRecordListVo>(queryVo.pageNo!!, queryVo.pageSize!!)
        val page =
            PageUtil<AppChatRecordListVo>().page(messageRecordMapper.appChatRecords(user.userId!!.toLong(), queryVo))
        if (page.total == 0L) {
            val messageRecord = botService.sayHello(queryVo.botId!!, user.userId!!, user.username)
            if (null != messageRecord) {
                return appChatRecords(queryVo, user)
            }
        }
        return page
    }

    override fun deleteChatMsg(msgId: Long, user: LoginUserInfo): List<String>? {
        val messageRecord = messageRecordMapper.selectById(msgId)
        Assert.notNull(messageRecord, "The message data does not exist")
        Assert.state(messageRecord.userId == user.userId, "You can only delete your own chat data")
        val list = mutableListOf(messageRecord.id.toString())
        if (messageRecord.sourceType == SourceTypeEnum.user) {
            //查询机器人回复用户这个消息的消息也连带删除
            val records = messageRecordMapper.selectList(
                KtQueryWrapper(MessageRecord::class.java).select(MessageRecord::id)
                    .eq(MessageRecord::replyMessageId, messageRecord.id)
                    .eq(MessageRecord::sourceType, SourceTypeEnum.bot)
            ).map { it.id.toString() }
            list.addAll(records)
        }
        messageRecordMapper.deleteBatchIds(list)
        return list
    }

    override fun handlerRespMsg(user: String?, baseMessageDTO: BaseMessageDTO) {
        if (!baseMessageDTO.test) {
            val respMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ResposeMessageBO::class.java)
            val messageRecord = messageRecordMapper.selectById(respMessageBO.msgId)
            //测试消息是查询不到记录的
            if (Objects.nonNull(messageRecord)) {
                if (messageRecord.sourceType == SourceTypeEnum.bot) {
                    messageRecordMapper.update(
                        MessageRecord().apply {
                            msgStatus = messageRecord.msgStatus
                        }, KtUpdateWrapper(MessageRecord::class.java).eq(
                            AssistantMsgRecord::id, messageRecord.replyMessageId
                        )
                    )
                }
            }
        }
    }

    override fun chatNum(userId: Long, minTime: String?, maxTime: String?, botId: Long?): Int {
        return messageRecordMapper.selectCount(
            KtQueryWrapper(MessageRecord::class.java).eq(MessageRecord::sourceType, SourceTypeEnum.user)
                .eq(MessageRecord::userId, userId).eq(Objects.nonNull(botId), MessageRecord::botId, botId)
                .ge(StrUtil.isNotBlank(minTime), MessageRecord::createdAt, minTime)
                .lt(StrUtil.isNotBlank(maxTime), MessageRecord::createdAt, maxTime)
        )
    }

    override fun handlerMsgRegenerate(user: String, baseMessageDTO: BaseMessageDTO) {
        try {
            //重新生成的消息
            val chatMsgRegenerateBO =
                JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ChatMsgRegenerateBO::class.java)
            //获取需要重新生成的消息对象
            val regenerateMessageRecord = messageRecordMapper.selectById(chatMsgRegenerateBO.msgId)
            if (null == regenerateMessageRecord) {
                chatService.respChatMsg(user, baseMessageDTO.failResp("Message does not exist"))
                return
            }
            if (regenerateMessageRecord.sourceType != SourceTypeEnum.bot) {
                chatService.respChatMsg(user, baseMessageDTO.failResp("Only support bot messages regenerate"))
                return
            }
            //查询聊天记录
            val messageRecords =
                this.getMessageRecords(regenerateMessageRecord.botId!!, regenerateMessageRecord.userId!!)
                    //映射为实体
                    .map {
                        JSONUtil.toBean(JSONObject(it), MessageRecord::class.java)
                    }
                    //过滤掉重新生成的消息id
                    .filter { it.id != regenerateMessageRecord.id }.toList()
            //找到机器人人回复的消息信息
            val messageRecord = messageRecordMapper.selectById(regenerateMessageRecord.replyMessageId)
            //开始处理消息,异步，对于baseMessageDTO对象，使用json序列化实现深拷贝
            chatService.replyBotMessage(
                messageRecord, user, JSONUtil.toJsonStr(baseMessageDTO), messageRecords, regenerateMessageRecord
            )
        } catch (e: BusinessException) {
            chatService.respChatMsg(user, baseMessageDTO.failResp("Failed to process chat message，${e.message}"))
        } catch (e: Exception) {
            chatService.respChatMsg(
                user, baseMessageDTO.failResp("Exception in handling chat messages, exception information:${e.message}")
            )
            StaticLog.error(e)
        }
    }
}