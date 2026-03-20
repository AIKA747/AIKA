package com.parsec.aika.content.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.StoryChatLogMapper
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.bo.ReadMessageBO
import com.parsec.aika.common.model.bo.ResposeMessageBO
import com.parsec.aika.common.model.bo.StoryNotifyContent
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.StoryChatLog
import com.parsec.aika.common.model.entity.StoryRecorder
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.remote.UserFeignClient
import com.parsec.aika.content.service.*
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import jakarta.annotation.PreDestroy
import jakarta.annotation.Resource
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class StoryMessageServiceImpl : StoryMessageService {

    @Autowired
    private lateinit var chatService: ChatService

    @Autowired
    private lateinit var storyService: StoryService

    @Autowired
    private lateinit var sttService: SttService

    @Autowired
    private lateinit var translateService: TranslateService

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    @Resource
    private lateinit var storyChatLogMapper: StoryChatLogMapper

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    @Resource
    private lateinit var notificationService: NotificationService

    /**
     * 默认语言
     */
    private final val defalutLanguage = "en"

    private val executorService = ThreadUtil.newExecutor(5, 10)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    override fun handlerChatMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        try {
            //获取用户聊天的消息体
            val chatMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ChatMessageBO::class.java)
            //查询用户存档
            val storyAndRecorder = storyService.getStoryAndRecorder(
                chatMessageBO.objectId!!.toLong(), chatMessageBO.userId!!.toLong(), baseMessageDTO.test
            )
            val storyRecorder = storyAndRecorder.second ?: throw BusinessException("Story save does not exist")
            Assert.state(storyRecorder.status != GameStatus.FAIL, "The story has failed, please start over")
            if (chatMessageBO.contentType == ContentType.VOICE) {
                Assert.notBlank(chatMessageBO.media, "语音文件链接请赋值给media字段")
                chatMessageBO.textContent = sttService.stt(chatMessageBO.media!!)
            }
            val storyChatLog = StoryChatLog().apply {
                this.storyId = storyRecorder.storyId
                this.chapterId = storyRecorder.chapterId
                this.storyRecorderId = storyRecorder.id
                this.sourceType = SourceTypeEnum.user
                this.contentType = chatMessageBO.contentType
                this.textContent = chatMessageBO.textContent
                this.media = chatMessageBO.media
                this.json = chatMessageBO.json
                this.creator = chatMessageBO.userId!!.toLong()
                this.createdAt = LocalDateTime.now()
                this.fileProperty = chatMessageBO.fileProperty
                this.msgStatus = MsgStatus.success
                this.creatorName = baseMessageDTO.username
            }
            //保存用户消息
            storyChatLogMapper.insert(storyChatLog)
            //回复client已收到消息成功，开始处理
            chatService.respChatMsg(user, baseMessageDTO.successResp(storyChatLog.id.toString()))

            val replyChatLog = StoryChatLog().apply {
                this.sourceType = SourceTypeEnum.story
                this.creator = storyRecorder.creator
                this.chapterId = storyRecorder.chapterId
                this.contentType = ContentType.TEXT
                this.textContent = ""
                this.storyRecorderId = storyRecorder.id
                this.createdAt = LocalDateTime.now()
                this.replyMessageId = storyChatLog.id
                this.storyId = storyRecorder.storyId
                this.msgStatus = MsgStatus.created
            }
            //保存故事回复消息
            storyChatLogMapper.insert(replyChatLog)

            chatMessageBO.contentType = replyChatLog.contentType
            chatMessageBO.msgId = replyChatLog.id.toString()
            chatMessageBO.media = ""
            chatMessageBO.json = ""
            chatMessageBO.msgStatus = MsgStatus.created
            chatMessageBO.createdAt = replyChatLog.createdAt
            chatMessageBO.replyMessageId = replyChatLog.replyMessageId.toString()
            chatMessageBO.sourceType = replyChatLog.sourceType
            chatService.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
            //异步执行
            executorService.execute {
                try {
                    chatMessageBO.msgStatus = MsgStatus.processing
                    chatService.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    //处理用户消息并回复
                    val replyToUser = storyService.replyToUser(storyChatLog, storyRecorder, baseMessageDTO.locale)
                    replyChatLog.gptJson = replyToUser.gptJson

                    chatMessageBO.sourceType = replyChatLog.sourceType
                    chatMessageBO.textContent = replyToUser.message
                    chatMessageBO.contentType = replyToUser.contentType
                    chatMessageBO.chapterStatus = replyToUser.status!!.name
                    chatMessageBO.msgId = replyChatLog.id.toString()
                    chatMessageBO.media = replyChatLog.media
                    chatMessageBO.json = replyChatLog.json
                    chatMessageBO.chapterProcess = replyToUser.chapterProcess
                    chatMessageBO.msgStatus = MsgStatus.success
                    chatService.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                } catch (e: Exception) {
                    chatMessageBO.msgStatus = MsgStatus.fail
                    chatMessageBO.textContent = "I didn't understand your message, please try again"
                    chatService.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    StaticLog.error("处理故事聊天信息异常：{}", e.message)
                    StaticLog.error(e)
                }
                replyChatLog.textContent = chatMessageBO.textContent
                replyChatLog.msgStatus = chatMessageBO.msgStatus
                storyChatLogMapper.updateById(replyChatLog)
            }
        } catch (e: BusinessException) {
            chatService.respChatMsg(user, baseMessageDTO.failResp("process chat message: ${e.message}"))
        } catch (e: IllegalStateException) {
            chatService.respChatMsg(user, baseMessageDTO.failResp("process chat message: ${e.message}"))
        } catch (e: Exception) {
            chatService.respChatMsg(
                user,
                baseMessageDTO.failResp("Exception in handling chat messages, exception information: ${e.message}")
            )
            StaticLog.error(e)
        }
    }

    override fun handlerReadMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        StaticLog.info("收到[$user]已读消息：${JSONUtil.toJsonStr(baseMessageDTO)}")
        val readMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ReadMessageBO::class.java)
        val messageRecord = storyChatLogMapper.selectById(readMessageBO.msgId)
        if (Objects.nonNull(messageRecord)) {
            messageRecord.readFlag = true
            messageRecord.readTime = readMessageBO.readAt
            storyChatLogMapper.updateById(messageRecord)
            if (messageRecord.sourceType == SourceTypeEnum.story) {
                storyChatLogMapper.update(
                    StoryChatLog().apply {
                        msgStatus = MsgStatus.success
                    }, KtUpdateWrapper(StoryChatLog::class.java).eq(
                        StoryChatLog::id, messageRecord.replyMessageId
                    )
                )
            }
        }
        chatService.respChatMsg(user, baseMessageDTO.successResp(null))
    }

    override fun queryChatLogs(
        req: com.parsec.aika.common.model.vo.req.AppChatLogReq, loginUserInfo: LoginUserInfo
    ): PageResult<com.parsec.aika.common.model.vo.resp.AppChatRecordListVo> {
        val page = Page<com.parsec.aika.common.model.vo.resp.AppChatRecordListVo>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        return PageUtil<com.parsec.aika.common.model.vo.resp.AppChatRecordListVo>().page(
            storyChatLogMapper.appMsgRecordList(
                page, req, loginUserInfo.userId!!
            )
        )
    }

    override fun handlerRespMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        StaticLog.info("收到[$user]RESP消息：${JSONUtil.toJsonStr(baseMessageDTO)}")
        val resposeMessageBO = JSONUtil.toBean(JSONObject(baseMessageDTO.msgData), ResposeMessageBO::class.java)
        val messageRecord = storyChatLogMapper.selectById(resposeMessageBO.msgId)
        if (Objects.nonNull(messageRecord)) {
            if (messageRecord.sourceType == SourceTypeEnum.story) {
                storyChatLogMapper.update(
                    StoryChatLog().apply {
                        msgStatus = messageRecord.msgStatus
                    }, KtUpdateWrapper(StoryChatLog::class.java).eq(
                        StoryChatLog::id, messageRecord.replyMessageId
                    )
                )
            }
        }
    }

    override fun chatNum(userId: Long, minTime: LocalDateTime?, maxTime: LocalDateTime?, storyId: Long?): Long {
        return storyChatLogMapper.selectCount(
            KtQueryWrapper(StoryChatLog::class.java).eq(StoryChatLog::sourceType, SourceTypeEnum.user)
                .eq(StoryChatLog::creator, userId).eq(Objects.nonNull(storyId), StoryChatLog::storyId, storyId)
                .lt(Objects.nonNull(maxTime), StoryChatLog::createdAt, maxTime)
                .ge(Objects.nonNull(minTime), StoryChatLog::createdAt, minTime)
        )
    }

    override fun sendStoryMessageToUser(
        storyRecorder: StoryRecorder,
        language: String?,
        message: String?,
        username: String?,
        jobId: Long?,
        operator: String?
    ) {
        //若任务信息为空则不发送
        if (StrUtil.isBlank(message)) {
            return
        }
        StaticLog.info("推送故事消息,原消息：{}", message)
        var taskMsg = message
        var translateLanguage = language
        if (StrUtil.isBlank(translateLanguage)) {
            val userInfo = userFeignClient.userInfo(storyRecorder.creator!!)
            translateLanguage = userInfo?.language
        }
        //用户是否设置语言
        if (StrUtil.isNotBlank(translateLanguage) && translateLanguage != defalutLanguage) {
            //翻译一下
            taskMsg = translateService.translateLanguage(message!!, translateLanguage!!)
        }
        //替换掉文本中得换行符
//        taskMsg = StrUtil.replace(taskMsg, """\\n""", "")
        StaticLog.info("推送故事消息，翻译后消息：{}", taskMsg)
        val chatLog = StoryChatLog().apply {
            this.sourceType = SourceTypeEnum.story
            this.creator = storyRecorder.creator
            this.chapterId = storyRecorder.chapterId
            this.contentType = ContentType.TEXT
            this.textContent = taskMsg
            this.storyRecorderId = storyRecorder.id
            this.createdAt = LocalDateTime.now()
            this.storyId = storyRecorder.storyId
            this.msgStatus = MsgStatus.success
            this.createdAt = LocalDateTime.now()
        }
        storyChatLogMapper.insert(chatLog)
        val baseMessageDTO = BaseMessageDTO().apply {
            this.chatModule = ChatModule.story
            this.test = false
            this.msgType = MsgType.CHAT_MSG
            this.msgData = createChatMessageBO(chatLog)
            this.sessionId = "${chatLog.creator}-${ChatModule.story.name}-${chatLog.storyId}"
        }
        chatService.respChatMsg("${UserTypeEnum.APPUSER.name}${storyRecorder.creator}", baseMessageDTO)
        //推送消息通知,消息到rabbitmq队列中
        notificationService.chatMessageNotify(
            listOf(storyRecorder.creator!!), "hi~,${username}", taskMsg!!, StoryNotifyContent().apply {
                this.id = storyRecorder.storyId.toString()
                this.storyId = storyRecorder.storyId
                this.recorderId = storyRecorder.id
                this.type = ChatroomNotifyType.STORY
            })
    }

    override fun getUserChatMinutes(chapterId: Long, userId: Long): Int {
        return storyChatLogMapper.getUserChatMinutes(chapterId, userId)
    }

    private fun createChatMessageBO(messageRecord: StoryChatLog): ChatMessageBO {
        val chatMessageBO = ChatMessageBO()
        chatMessageBO.objectId = messageRecord.storyId.toString()
        chatMessageBO.userId = messageRecord.creator.toString()
        chatMessageBO.contentType = messageRecord.contentType
        chatMessageBO.textContent = messageRecord.textContent
        chatMessageBO.media = messageRecord.media
        chatMessageBO.fileProperty = messageRecord.fileProperty
        chatMessageBO.msgId = messageRecord.id.toString()
        chatMessageBO.replyMessageId = messageRecord.replyMessageId.toString()
        chatMessageBO.sourceType = messageRecord.sourceType
        chatMessageBO.createdAt = messageRecord.createdAt
        chatMessageBO.msgStatus = messageRecord.msgStatus
        return chatMessageBO
    }


}
