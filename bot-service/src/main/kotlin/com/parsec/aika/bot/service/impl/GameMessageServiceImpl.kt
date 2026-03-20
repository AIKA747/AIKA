package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.bot.service.*
import com.parsec.aika.common.mapper.GameMessageRecordMapper
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.bo.ReadMessageBO
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.GameMessageRecord
import com.parsec.aika.common.model.entity.GameThread
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.annotation.Resource

@Service
class GameMessageServiceImpl : GameMessageService {

    @Autowired
    private lateinit var gameService: GameService

    @Resource
    private lateinit var gameMessageRecordMapper: GameMessageRecordMapper

    @Resource
    private lateinit var sttService: SttService

    @Autowired
    private lateinit var chatService: ChatService

    @Autowired
    private lateinit var translateService: TranslateService


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
            val messageRecord = GameMessageRecord().apply {
                this.threadId = chatMessageBO.objectId!!.toLong()
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
                this.gameQuestion = false
            }
            gameMessageRecordMapper.insert(messageRecord)
            //回复client已收到消息成功，开始处理
            chatService.respChatMsg(user, baseMessageDTO.successResp(messageRecord.id.toString()))
            //开始处理消息,异步，对于baseMessageDTO对象，使用json序列化实现深拷贝
            chatService.replyGameMessage(messageRecord, user, baseMessageDTO.deepCopy())
        } catch (e: BusinessException) {
            e.printStackTrace()
            chatService.respChatMsg(user, baseMessageDTO.failResp(e.message ?: "Failed to process chat message"))
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
            val messageRecord = gameMessageRecordMapper.selectById(readMessageBO.msgId)
            if (Objects.nonNull(messageRecord)) {
                messageRecord.readFlag = true
                messageRecord.readTime = readMessageBO.readAt
                gameMessageRecordMapper.updateById(messageRecord)
                if (messageRecord.sourceType == SourceTypeEnum.bot) {
                    gameMessageRecordMapper.update(
                        GameMessageRecord().apply {
                            msgStatus = MsgStatus.success
                        }, KtUpdateWrapper(GameMessageRecord::class.java).eq(
                            GameMessageRecord::id, messageRecord.replyMessageId
                        )
                    )
                }
            }
        }
        chatService.respChatMsg(user, baseMessageDTO.successResp(null))
    }

    override fun handlerMsgRegenerate(user: String, baseMessageDTO: BaseMessageDTO) {
        chatService.respChatMsg(
            user, baseMessageDTO.failResp("Game chat does not currently support message regeneration")
        )
    }

    override fun appChatRecords(queryVo: AppChatRecordQueryVo, user: LoginUserInfo): PageResult<AppChatRecordListVo>? {
        Assert.notNull(queryVo.threadId, "threadId cannot be empty")
        PageHelper.startPage<AppChatRecordListVo>(queryVo.pageNo!!, queryVo.pageSize!!)
        return PageUtil<AppChatRecordListVo>().page(
            gameMessageRecordMapper.appChatRecords(
                user.userId!!.toLong(), queryVo
            )
        )
    }

    override fun getThreadChatRecords(threadId: Long, userId: Long, onlyQuestion: Boolean): List<GameMessageRecord> {
        return gameMessageRecordMapper.selectList(
            KtQueryWrapper(GameMessageRecord::class.java).eq(GameMessageRecord::threadId, threadId)
                .eq(GameMessageRecord::userId, userId).eq(onlyQuestion, GameMessageRecord::gameQuestion, onlyQuestion)
                .orderByDesc(GameMessageRecord::createdAt).last(!onlyQuestion, "limit 20")
        )
    }

    @Async
    override fun sendGameMessageToUser(gameThread: GameThread, loginUser: LoginUserInfo) {
        //查询用户信息
        val gameDetail = gameService.getGameDetail(gameThread.gameId!!)
        var messageText = gameDetail.description ?: "hi,nice to meet you!!"
        if (StrUtil.isNotBlank(loginUser.language)) {
            messageText = translateService.translateLanguage(messageText, loginUser.language!!)!!
        }
        val messageRecord = GameMessageRecord().apply {
            this.threadId = gameThread.id
            this.userId = gameThread.creator
            this.contentType = ContentType.TEXT
            this.sourceType = SourceTypeEnum.game
            this.textContent = messageText
            this.msgStatus = MsgStatus.success
            this.readFlag = false
            this.gameQuestion = false
            this.gameStatus = gameThread.status
            this.creator = gameThread.creator
            this.createdAt = LocalDateTime.now()
        }
        gameMessageRecordMapper.insert(messageRecord)
        //推送消息创建成功
        val baseMessageDTO = BaseMessageDTO().apply {
            this.chatModule = ChatModule.story
            this.test = false
            this.msgType = MsgType.CHAT_MSG
            this.msgData = chatService.createChatMessageBO(messageRecord)
            this.sessionId = "${messageRecord.userId}-${ChatModule.game.name}-${messageRecord.threadId}"
        }
        chatService.respChatMsg("${UserTypeEnum.APPUSER.name}${messageRecord.userId}", baseMessageDTO)
    }
}