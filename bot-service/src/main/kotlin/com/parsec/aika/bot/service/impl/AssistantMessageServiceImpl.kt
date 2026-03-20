package com.parsec.aika.bot.service.impl

import cn.hutool.core.convert.Convert.toInt
import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.parsec.aika.bot.service.AssistantMessageService
import com.parsec.aika.bot.service.AssistantService
import com.parsec.aika.bot.service.ChatService
import com.parsec.aika.bot.service.SttService
import com.parsec.aika.common.mapper.AssistantMsgRecordMapper
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.bo.ChatMsgRegenerateBO
import com.parsec.aika.common.model.bo.ReadMessageBO
import com.parsec.aika.common.model.bo.ResposeMessageBO
import com.parsec.aika.common.model.const.RedisConst
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.MsgStatus
import com.parsec.aika.common.model.em.SourceTypeEnum
import com.parsec.aika.common.model.entity.AssistantMsgRecord
import com.parsec.aika.common.model.entity.UserAssistant
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.annotation.Resource

@RefreshScope
@Service
class AssistantMessageServiceImpl : AssistantMessageService {

    @Autowired
    private lateinit var chatService: ChatService

    @Autowired
    private lateinit var assistantService: AssistantService

    @Resource
    private lateinit var sttService: SttService

    @Autowired
    private lateinit var assistantMsgRecordMapper: AssistantMsgRecordMapper

    @Autowired
    private lateinit var redisTemplate: RedisTemplate<String, Any>

    @Value("\${chat.history.length:10}")
    private val chatHistoryLength = 10L

    @Value("\${chat.user.videoGenerateNum:3}")
    private val videoGenerateNum: Long? = null

    override fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        try {
            //获取用户聊天的消息体
            val chatMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ChatMessageBO::class.java)
            if (chatMessageBO.digitHuman == true) {
                val num = redisTemplate.opsForValue().get("${RedisConst.userVideoGenerateNum}:${chatMessageBO.userId}")
                if (num != null && toInt(num) > videoGenerateNum!!) {
                    chatService.respChatMsg(
                        user,
                        baseMessageDTO.failResp("The number of times the digital human experience has been used up")
                    )
                    return
                }
            }
            if (chatMessageBO.contentType == ContentType.VOICE) {
                Assert.notBlank(chatMessageBO.media, "语音文件链接请赋值给media字段")
                chatMessageBO.textContent = sttService.stt(chatMessageBO.media!!)
            }
            val userAssistant = if (baseMessageDTO.test) {
                UserAssistant().apply {
                    assistantId = chatMessageBO.objectId!!.toLong()
                    userId = chatMessageBO.userId!!.toLong()
                    gender = Gender.MALE
                }
            } else {
                assistantService.getUserAssistant(chatMessageBO.userId!!.toLong())
            }
            //构建助手聊天消息
            val messageRecord = AssistantMsgRecord().apply {
                this.assistantId = chatMessageBO.objectId!!.toLong()
                this.userId = chatMessageBO.userId!!.toLong()
                this.assistantGender = userAssistant.gender
                this.sourceType = SourceTypeEnum.user
                this.contentType = chatMessageBO.contentType
                this.textContent = chatMessageBO.textContent
                this.fileProperty = chatMessageBO.fileProperty
                this.media = chatMessageBO.media
                this.creator = chatMessageBO.userId!!.toLong()
                this.createdAt = LocalDateTime.now()
                this.json = chatMessageBO.json
                this.digitHuman = chatMessageBO.digitHuman
                this.msgStatus = MsgStatus.success
                this.creatorName = baseMessageDTO.username
            }
            //非测试消息非数字人消息则保存消息内容到数据库
            if (!baseMessageDTO.test) {
                assistantMsgRecordMapper.insert(messageRecord)
            } else {
                messageRecord.id = System.currentTimeMillis()
            }
            //缓存消息到redis
            val redisKey =
                "${RedisConst.assistantMsgRecordListKey}:${messageRecord.assistantId}:${chatMessageBO.userId}"
            redisTemplate.opsForList().rightPush(redisKey, JSONUtil.toJsonStr(messageRecord))
            val pair = assistantService.generatePrompt(
                chatMessageBO.objectId!!.toLong(),
                userAssistant,
                baseMessageDTO.locale ?: "en",
                chatMessageBO.digitHuman,
                baseMessageDTO.username
            )
            //回复client已收到消息成功，开始处理
            chatService.respChatMsg(user, baseMessageDTO.successResp(messageRecord.id.toString()))

            val list = redisTemplate.opsForList().range(redisKey, 0, chatHistoryLength)
            val messageRecords = list!!.map {
                JSONUtil.toBean(JSONObject(it), AssistantMsgRecord::class.java)
            }.toList()
            //开始回复消息
            chatService.replyAssistantMsg(
                pair.first,
                pair.second,
                messageRecord,
                user,
                userAssistant,
                JSONUtil.toJsonStr(baseMessageDTO),
                chatMessageBO.digitHuman,
                messageRecords
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

    override fun handlerReadMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        if (!baseMessageDTO.test) {
            val readMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ReadMessageBO::class.java)
            val messageRecord = assistantMsgRecordMapper.selectById(readMessageBO.msgId)
            //数字人消息已读是查询不到记录的
            if (Objects.nonNull(messageRecord)) {
                messageRecord.readFlag = true
                messageRecord.readTime = readMessageBO.readAt
                assistantMsgRecordMapper.updateById(messageRecord)
                if (messageRecord.sourceType == SourceTypeEnum.assistant) {
                    assistantMsgRecordMapper.update(
                        AssistantMsgRecord().apply {
                            msgStatus = MsgStatus.success
                        }, KtUpdateWrapper(AssistantMsgRecord::class.java).eq(
                            AssistantMsgRecord::id, messageRecord.replyMessageId
                        )
                    )
                }
            }
        }
        chatService.respChatMsg(user, baseMessageDTO.successResp(null))
    }

    override fun handlerRespMsg(user: String?, baseMessageDTO: BaseMessageDTO) {
        if (!baseMessageDTO.test) {
            val respMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ResposeMessageBO::class.java)
            val messageRecord = assistantMsgRecordMapper.selectById(respMessageBO.msgId)
            //数字人消息已读是查询不到记录的
            if (Objects.nonNull(messageRecord)) {
                assistantMsgRecordMapper.updateById(messageRecord)
                if (messageRecord.sourceType == SourceTypeEnum.assistant) {
                    assistantMsgRecordMapper.update(
                        AssistantMsgRecord().apply {
                            msgStatus = messageRecord.msgStatus
                        }, KtUpdateWrapper(AssistantMsgRecord::class.java).eq(
                            AssistantMsgRecord::id, messageRecord.replyMessageId
                        )
                    )
                }
            }
        }
    }

    override fun handlerMsgRegenerate(user: String, baseMessageDTO: BaseMessageDTO) {
        try {
            //重新生成的消息
            val chatMsgRegenerateBO =
                JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ChatMsgRegenerateBO::class.java)
            //获取需要重新生成的消息对象
            val messageRecord = assistantMsgRecordMapper.selectById(chatMsgRegenerateBO.msgId)
            if (null == messageRecord) {
                chatService.respChatMsg(user, baseMessageDTO.failResp("Message does not exist"))
                return
            }
            if (messageRecord.sourceType != SourceTypeEnum.assistant) {
                chatService.respChatMsg(user, baseMessageDTO.failResp("Only support assistant messages regenerate"))
                return
            }
            val userAssistant = assistantService.getUserAssistant(messageRecord.userId!!)
            val pair = assistantService.generatePrompt(
                messageRecord.assistantId!!,
                userAssistant,
                baseMessageDTO.locale ?: "en",
                messageRecord.digitHuman,
                baseMessageDTO.username
            )
            //回复client已收到消息成功，开始处理
            chatService.respChatMsg(user, baseMessageDTO.successResp(messageRecord.id.toString()))
            //查询该消息之前的历史消息
            val messageRecords = assistantMsgRecordMapper.selectList(
                KtQueryWrapper(AssistantMsgRecord::class.java).eq(
                    AssistantMsgRecord::assistantId, messageRecord.assistantId
                ).eq(AssistantMsgRecord::userId, messageRecord.userId).lt(AssistantMsgRecord::id, messageRecord.id)
                    .orderByDesc(AssistantMsgRecord::id)
            )
            messageRecords.reverse()
            //开始回复消息
            chatService.regenerateAssistantMsg(
                pair.first,
                pair.second,
                messageRecord,
                user,
                userAssistant,
                JSONUtil.toJsonStr(baseMessageDTO),
                messageRecord.digitHuman,
                messageRecords
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