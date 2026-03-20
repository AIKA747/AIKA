package com.parsec.aika.bot.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.collection.CollUtil
import cn.hutool.core.io.FileUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.core.util.URLUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_MSG_DIRECT_EXCHANGE
import com.parsec.aika.bot.config.RabbitmqConst.CHAT_MSG_DOWN_ROUTE_KEY
import com.parsec.aika.bot.gpt.ChatMessage
import com.parsec.aika.bot.gpt.GptClient
import com.parsec.aika.bot.service.*
import com.parsec.aika.common.mapper.AssistantMsgRecordMapper
import com.parsec.aika.common.mapper.GameMessageRecordMapper
import com.parsec.aika.common.mapper.MessageRecordMapper
import com.parsec.aika.common.mapper.UserBotTaskMapper
import com.parsec.aika.common.model.bo.ChatMessageBO
import com.parsec.aika.common.model.bo.ImageMessageBO
import com.parsec.aika.common.model.const.RedisConst
import com.parsec.aika.common.model.const.RedisConst.chatImageKey
import com.parsec.aika.common.model.const.RedisConst.chatVideKey
import com.parsec.aika.common.model.dto.BaseMessageDTO
import com.parsec.aika.common.model.dto.MessageDTO
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.*
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.TimeUnit
import javax.annotation.PreDestroy
import javax.annotation.Resource

@Service
class ChatServiceImpl : ChatService {
    @Autowired
    private lateinit var botMessageService: BotMessageService

    @Autowired
    private lateinit var messageRecordMapper: MessageRecordMapper

    @Autowired
    private lateinit var assistantMsgRecordMapper: AssistantMsgRecordMapper

    @Autowired
    private lateinit var gameMessageRecordMapper: GameMessageRecordMapper

    @Autowired
    private lateinit var rabbitTemplate: RabbitTemplate

    @Autowired
    private lateinit var gptClient: GptClient

    @Autowired
    private lateinit var didService: DidService

    @Autowired
    private lateinit var ttsService: TtsService

    @Autowired
    private lateinit var humanProfileService: BotDigitalHumanProfileService

    @Autowired
    private lateinit var recommendService: AssistantRecommendService

    @Autowired
    private lateinit var fileUploadService: FileUploadService

    @Autowired
    private lateinit var botService: BotService

    @Resource
    private lateinit var imageService: ImageService

    @Resource
    private lateinit var gameService: GameService

    @Resource
    private lateinit var gameAiAssistantService: GameAiAssistantService

    @Autowired
    private lateinit var userBotTaskMapper: UserBotTaskMapper

    @Autowired
    private lateinit var botTaskService: BotTaskService

    @Autowired
    private lateinit var redisTemplate: RedisTemplate<String, Any>

    @Value("\${chat.history.length:10}")
    private var chatHistoryLength: Long = 10

    @Value("\${chat.digitHumanSwitch:false}")
    private var digitHumanSwitch: Boolean? = null

    private val executorService = ThreadUtil.newExecutor(5, 10)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    override fun respChatMsg(user: String, baseMessageDTO: BaseMessageDTO) {
        StaticLog.debug("${user},推送消息：${JSONUtil.toJsonStr(baseMessageDTO)}")
        rabbitTemplate.convertAndSend(
            CHAT_MSG_DIRECT_EXCHANGE, CHAT_MSG_DOWN_ROUTE_KEY, MessageDTO.createMessage(user, baseMessageDTO)
        )
    }

    override fun replyBotMessage(
        messageRecord: MessageRecord,
        user: String,
        baseMessageStr: String,
        messageRecords: List<MessageRecord>,
        regenerateMessageRecord: MessageRecord?
    ) {
        StaticLog.info("开始处理bot聊天消息回复.......1")
        val replyMessageRecord = regenerateMessageRecord ?: MessageRecord()
        replyMessageRecord.apply {
            this.botId = messageRecord.botId
            this.userId = messageRecord.userId
            this.contentType = ContentType.md
            this.sourceType = SourceTypeEnum.bot
            this.textContent = ""
            this.msgStatus = MsgStatus.created
            this.readFlag = false
            this.creator = messageRecord.userId
            this.createdAt = LocalDateTime.now()
        }
        val baseMessageDTO = JSONUtil.toBean(baseMessageStr, BaseMessageDTO::class.java)
        //非测试消息非数字人消息则保存消息内容到数据库
        if (!baseMessageDTO.test) {
            if (replyMessageRecord.id == null) {
                replyMessageRecord.replyMessageId = messageRecord.id
                messageRecordMapper.insert(replyMessageRecord)
            } else {
                messageRecordMapper.updateById(replyMessageRecord)
            }
            messageRecord.readFlag = true
            messageRecord.readTime = LocalDateTime.now()
            messageRecordMapper.updateById(messageRecord)
        } else {
            replyMessageRecord.id = System.currentTimeMillis()
        }
        //判断是否为测试消息,查询对应的机器人promt配置信息
        val pair = botService.generatePrompt(
            messageRecord.botId!!, baseMessageDTO.test, baseMessageDTO.username
        )
        val bot = pair.first
        val prompt = pair.second
        if (bot.botStatus != BotStatusEnum.online) {
            replyMessageRecord.textContent = "The current session has failed. The robot status is ${bot.botStatus}."
            replyMessageRecord.msgStatus = MsgStatus.success
            this.respChatMsg(user, baseMessageDTO.chatMsgResp(createChatMessageBO(replyMessageRecord)))
            return
        }
        //获取用户聊天的消息体
        var chatMessageBO = createChatMessageBO(replyMessageRecord)
        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
        executorService.execute {
            StaticLog.debug("开始处理bot聊天消息回复.......2")
            val formatBotMsg: FormatBotMsg?
            try {
                replyMessageRecord.msgStatus = MsgStatus.processing

                chatMessageBO = createChatMessageBO(replyMessageRecord)
                this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))

                if (messageRecord.contentType == ContentType.IMAGE) {
                    Assert.notBlank(messageRecord.media, "图片链接请赋值给media字段")
                    replyMessageRecord.textContent =
                        imageService.imageToText(messageRecord.textContent, messageRecord.media!!)
                    replyMessageRecord.msgStatus = MsgStatus.success
                    if (!baseMessageDTO.test) {
                        messageRecordMapper.updateById(replyMessageRecord)
                        //更新机器人对话数量和聊天数量
                        botService.updateBotChatNum(replyMessageRecord.botId)
                    }

                    chatMessageBO = createChatMessageBO(replyMessageRecord)
                    this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))

                    replyMessageRecord.formatBotMsg = FormatBotMsg().apply {
                        this.generateImage = false
                        this.imagePrompt = ""
                        this.answer = replyMessageRecord.textContent
                    }
                    botMessageService.cacheMessageRecord(replyMessageRecord)
                    return@execute
                }
                //发送消息给gpt，并得到响应
                val chatmessages = messageRecords.filter {
                    StrUtil.isNotBlank(it.textContent)
                }.map {
                    if (it.sourceType == SourceTypeEnum.user) {
                        ChatMessage("user", it.textContent!!)
                    } else {
                        if (Objects.isNull(it.formatBotMsg)) {
                            it.formatBotMsg = FormatBotMsg().apply {
                                this.generateImage = false
                                this.imagePrompt = ""
                                this.answer = it.textContent
                            }
                        }
                        ChatMessage("assistant", JSONUtil.toJsonStr(it.formatBotMsg))
                    }
                }
                //调用chatgpt
                val msgResp = gptClient.send(
                    prompt, chatmessages = chatmessages, useFun = true, jsonProperties = JSONObject().apply {
                        this["type"] = "object"
                        this["properties"] = JSONObject().apply {
                            this["answer"] = JSONObject().apply {
                                this["type"] = "string"
                                this["description"] =
                                    "Reply to the user's messages, the reply content cannot be empty, Default to md format text"
                            }
                            this["generateImage"] = JSONObject().apply {
                                this["type"] = "boolean"
                                this["description"] =
                                    "the user ask you to respond to the content of the images.please return true or false"
                            }
                            this["imagePrompt"] = JSONObject().apply {
                                this["type"] = "string"
                                this["description"] =
                                    "If generateImage=true, then this field returns the prompt for generating the image"
                            }
                            this["closeTask"] = JSONObject().apply {
                                this["type"] = "boolean"
                                this["description"] =
                                    "Determine whether the most recently executed task needs to be closed."
                            }
                            this["generateTask"] = JSONObject().apply {
                                this["type"] = "boolean"
                                this["description"] =
                                    "Analyze whether the assistant needs to generate a scheduled task for the user(To close the task without creating a new one, set closeTask to true). please return true or false"
                            }
                            this["taskType"] = JSONObject().apply {
                                this["type"] = "string"
                                this["enum"] = listOf("REMINDER", "WEBSEARCH", "EXECUTEONCE")
                                this["description"] =
                                    "If generateTask=true,This parameter specifies the task type:REMINDER(Message timing reminder),WEBSEARCH(Timed network retrieval of messages), EXECUTEONCE(Perform a real-time network lookup now)"
                            }
                            this["taskName"] = JSONObject().apply {
                                this["type"] = "string"
                                this["description"] =
                                    "If generateTask=true,then this field returns the name of the task"
                            }
                            this["taskIntroduction"] = JSONObject().apply {
                                this["type"] = "string"
                                this["description"] =
                                    "If generateTask=true,then this field returns the introduction of the task."
                            }
                            this["message"] = JSONObject().apply {
                                this["type"] = "string"
                                this["description"] =
                                    "If generateTask=true,then This field returns the reminder content sent to the user."
                            }
                            this["taskCron"] = JSONObject().apply {
                                this["type"] = "string"
                                this["description"] =
                                    "If `generateTask` is true, this field must contain a valid Quartz Cron expression with 7 fields (not the standard Unix 5-field format). The expression must be valid for the Quartz scheduler.The task frequency must not be less than 1 minute. For example, if the task should run every 3 minutes, the expression must use a minute-based interval, such as `0 0/3 * * * ?`.Do not generate expressions that result in execution intervals shorter than one minute (e.g., every 3 seconds). The system operates in the UTC time zone. If the user's time zone is known, the cron expression must be adjusted to match their local time. If the user's time zone cannot be determined from the conversation, assume the default time zone is Kazakhstan Standard Time (UTC+6)."
                            }
                            this["taskPrompt"] = JSONObject().apply {
                                this["type"] = "string"
                                this["description"] =
                                    "If generateTask=true and taskType is WEBSEARCH or EXECUTEONCE, request to generate a prompt for collecting network resource information, In the prompt, please specify in as much detail as possible the website addresses or names that can be used for data collection."
                            }
                            this["executeLimit"] = JSONObject().apply {
                                this["type"] = "integer"
                                this["description"] =
                                    "If generateTask=true, Returns the minimum execution count required to complete the generation task. If infinite loop execution is required, it returns -1."
                            }
                        }
                        this["required"] = listOf("answer", "generateImage", "generateTask", "message")
                    })
                StaticLog.debug("bot chatGpt响应消息：$msgResp")
                formatBotMsg = JSONUtil.toBean(msgResp, FormatBotMsg::class.java)
                replyMessageRecord.textContent = formatBotMsg.answer
                if (!baseMessageDTO.test) {
                    messageRecordMapper.updateById(replyMessageRecord)
                }
                replyMessageRecord.formatBotMsg = formatBotMsg
                botMessageService.cacheMessageRecord(replyMessageRecord)
                //判断是否需要生成图片
                if (StrUtil.isBlank(replyMessageRecord.textContent) && formatBotMsg.generateImage == true) {
                    replyMessageRecord.textContent = formatBotMsg.imagePrompt
                }
            } catch (e: Exception) {
                chatMessageBO.msgStatus = MsgStatus.fail
                chatMessageBO.textContent = "The robot did not understand your message, please try again"
                this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                replyMessageRecord.msgStatus = chatMessageBO.msgStatus
                replyMessageRecord.textContent = chatMessageBO.textContent
                if (!baseMessageDTO.test) {
                    messageRecordMapper.updateById(replyMessageRecord)
                    //更新机器人对话数量和聊天数量
                    botService.updateBotChatNum(replyMessageRecord.botId)
                }
                StaticLog.error(e)
                return@execute
            }
            StaticLog.debug("bot.supportedModels:{}", JSONUtil.toJsonStr(bot.supportedModels))

            if (CollUtil.isNotEmpty(bot.supportedModels) && bot.supportedModels!!.contains(SupportedModelEnum.Midjourney.name)) {
                StaticLog.debug("该机器人支持生成图片....")
                if (formatBotMsg.generateImage == true) {
                    StaticLog.debug("该机器人开始生成图片，处理生成图片逻辑，prompt:${formatBotMsg.imagePrompt}")
                    if (StrUtil.isNotBlank(formatBotMsg.imagePrompt)) {
                        val imageUrl = imageService.textToImage(formatBotMsg.imagePrompt!!)
                        if (StrUtil.isNotBlank(imageUrl)) {
                            val record = BeanUtil.copyProperties(
                                replyMessageRecord, MessageRecord::class.java, "id", "createdAt"
                            )
                            record.id = null
                            record.msgStatus = MsgStatus.success
                            record.contentType = ContentType.IMAGE
                            record.textContent = formatBotMsg.imagePrompt
                            record.media = imageUrl
                            record.createdAt = LocalDateTime.now()
                            if (!baseMessageDTO.test) {
                                messageRecordMapper.insert(record)
                            }
                            if (record.msgStatus == MsgStatus.success) {
                                this.respChatMsg(
                                    user, baseMessageDTO.imageResp(
                                        ImageMessageBO(
                                            record.id.toString(), record.media, "100%", "SUCCESS"
                                        )
                                    )
                                )
                            }
                            chatMessageBO = createChatMessageBO(record)
                            this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                            if (record.msgStatus == MsgStatus.success && !baseMessageDTO.test) {
                                this.updateImageUrl(record)
                            }
                        }
                    }
                }
            }
            //获取用户聊天的消息体
            replyMessageRecord.msgStatus = MsgStatus.success
            if (!baseMessageDTO.test) {
                messageRecordMapper.updateById(replyMessageRecord)
                //更新机器人对话数量和聊天数量
                botService.updateBotChatNum(replyMessageRecord.botId)
            }
            chatMessageBO = createChatMessageBO(replyMessageRecord)
            this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
            if (formatBotMsg.closeTask == true) {
                botTaskService.closeBotTask(replyMessageRecord.userId, replyMessageRecord.botId)
            }
            //判断是否生成任务
            if (formatBotMsg.generateTask == true) {
                val botTask = UserBotTask().apply {
                    this.type = formatBotMsg.taskType
                    this.name = formatBotMsg.taskName
                    this.introduction = formatBotMsg.taskIntroduction
                    this.message = formatBotMsg.message
                    this.cron = formatBotMsg.taskCron
                    this.prompt = formatBotMsg.taskPrompt
                    this.botId = replyMessageRecord.botId
                    this.creater = replyMessageRecord.userId
                    this.status = BotTaskStatus.PENDING
                    this.executeLimit = formatBotMsg.executeLimit ?: 0
                }
                if (StrUtil.isBlank(botTask.cron)) {
                    botTask.type = BotTaskType.EXECUTEONCE
                }
                userBotTaskMapper.insert(botTask)
                //如果是websearch的任务，直接自动开始，不用推送任务消息
                if (botTask.type == BotTaskType.WEBSEARCH || botTask.type == BotTaskType.EXECUTEONCE) {
                    botTaskService.putBotTaskStatus(botTask.id!!, BotTaskStatus.ENABLED)
                } else {
                    replyMessageRecord.contentType = ContentType.task
                    replyMessageRecord.textContent = formatBotMsg.taskName
                    replyMessageRecord.json = JSONUtil.toJsonStr(botTask)
                    if (!baseMessageDTO.test) {
                        replyMessageRecord.id = null
                        messageRecordMapper.insert(replyMessageRecord)
                    } else {
                        replyMessageRecord.id = System.currentTimeMillis()
                    }
                    chatMessageBO = createChatMessageBO(replyMessageRecord)
                    this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                }
            }
        }
    }

    override fun videoWeebhook(reqObj: JSONObject) {
        val id = reqObj.getStr("id")
        val redisKey = "$chatVideKey:$id"
        if (redisTemplate.hasKey(redisKey)) {
            val user = redisTemplate.opsForHash<String, String>().get(redisKey, "user")
            val baseMessageStr = redisTemplate.opsForHash<String, String>().get(redisKey, "baseMessage")
            val baseMessage = JSONUtil.toBean(baseMessageStr, BaseMessageDTO::class.java)
            val status = reqObj.getStr("status")
            //获取用户聊天的消息体
            val chatMessageBO = JSONUtil.toBean(JSONObject(baseMessage!!.msgData), ChatMessageBO::class.java)
//            chatMessageBO.contentType = ContentType.VIDEO
            val messageRecordStr = redisTemplate.opsForHash<String, String>().get(redisKey, "messageRecord")
            if (status == "done") {
                val videoUrl = reqObj.getStr("result_url")
                chatMessageBO.videoUrl = fileUploadService.uploadFile(videoUrl, "mp4", "video/mp4", "videos")
                if (baseMessage.chatModule == ChatModule.bot) {
                    val messageRecord = JSONUtil.toBean(messageRecordStr, MessageRecord::class.java)
                    chatMessageBO.msgId = messageRecord.id.toString()
                    chatMessageBO.textContent = messageRecord.textContent
                    chatMessageBO.createdAt = messageRecord.createdAt
                    chatMessageBO.sourceType = messageRecord.sourceType
                    chatMessageBO.replyMessageId = messageRecord.replyMessageId
                    messageRecordMapper.update(MessageRecord().apply {
                        this.media = chatMessageBO.videoUrl
//                        this.contentType = ContentType.VIDEO
                    }, KtUpdateWrapper(MessageRecord::class.java).eq(MessageRecord::id, messageRecord.id))
                } else if (baseMessage.chatModule == ChatModule.assistant) {
                    val messageRecord = JSONUtil.toBean(messageRecordStr, AssistantMsgRecord::class.java)
                    chatMessageBO.msgId = messageRecord.id.toString()
                    chatMessageBO.textContent = messageRecord.textContent
                    chatMessageBO.createdAt = messageRecord.createdAt
                    chatMessageBO.sourceType = messageRecord.sourceType
                    chatMessageBO.replyMessageId = messageRecord.replyMessageId
                    chatMessageBO.msgStatus = MsgStatus.success
                    assistantMsgRecordMapper.update(
                        AssistantMsgRecord().apply {
                            this.media = chatMessageBO.media
                            this.videoUrl = chatMessageBO.videoUrl
                            this.videoStatus = VideoStatus.success
                            this.msgStatus = MsgStatus.success
                        }, KtUpdateWrapper(AssistantMsgRecord::class.java).eq(AssistantMsgRecord::id, messageRecord.id)
                    )
                }
//                chatMessageBO.contentType = ContentType.VIDEO
                chatMessageBO.videoStatus = VideoStatus.success
                this.respChatMsg(user!!, baseMessage.chatMsgResp(chatMessageBO))
                redisTemplate.delete(redisKey)
            }
            if (status == "error") {
                StaticLog.error("生成视频失败：{}", reqObj.toString())
                chatMessageBO.videoStatus = VideoStatus.fail
                this.respChatMsg(user!!, baseMessage.chatMsgResp(chatMessageBO))
                redisTemplate.delete(redisKey)
            }
        }
    }

    override fun imageWebhook(jsonObject: JSONObject) {
        val state = jsonObject.getStr("state")
        val id = jsonObject.getStr("id")
        val redisKey = "${chatImageKey}:$id"
        if (redisTemplate.hasKey(redisKey)) {
            StaticLog.debug("开始推送图片任务进度信息。。。")
            val status = jsonObject.getStr("status")
            val progress = jsonObject.getStr("progress")
            val imageUrl = jsonObject.getStr("imageUrl")
            if (listOf("IN_PROGRESS", "FAILURE", "SUCCESS").contains(status)) {
                //当图片链接为空时，不用推送进度
                if (status == "IN_PROGRESS" && StrUtil.isEmpty(imageUrl)) {
                    return
                }
                val user = redisTemplate.opsForHash<String, String>().get(redisKey, "user")
                StaticLog.debug("开始推送图片任务进度，目标用户[$user],进度[$progress]")
                val messageRecordStr = redisTemplate.opsForHash<String, String>().get(redisKey, "messageRecord")
                val baseMessageStr = redisTemplate.opsForHash<String, String>().get(redisKey, "baseMessage")
                val baseMessage = JSONUtil.toBean(baseMessageStr, BaseMessageDTO::class.java)
                if (state == GenerateType.botChat.name) {
                    val messageRecord = JSONUtil.toBean(messageRecordStr, MessageRecord::class.java)
                    //推送图片消息的进度
                    this.respChatMsg(
                        user!!, baseMessage!!.imageResp(
                            ImageMessageBO(
                                messageRecord!!.id.toString(), imageUrl, progress, status
                            )
                        )
                    )
                    if (status == "SUCCESS" && !baseMessage.test) {
                        //非测试消息，修改一下消息的类型,并保存修改后的消息记录
                        messageRecord.contentType = ContentType.IMAGE
                        messageRecord.media = imageUrl
                        messageRecord.msgStatus = MsgStatus.success
                        messageRecordMapper.updateById(messageRecord)
                        redisTemplate.delete(redisKey)
                        this.updateImageUrl(messageRecord)
                    }
                } else if (state == GenerateType.assistantChat.name) {
                    val messageRecord = JSONUtil.toBean(messageRecordStr, AssistantMsgRecord::class.java)
                    //推送图片消息的进度
                    this.respChatMsg(
                        user!!, baseMessage!!.imageResp(
                            ImageMessageBO(
                                messageRecord!!.id.toString(), imageUrl, progress, status
                            )
                        )
                    )
                    if (status == "SUCCESS" && !baseMessage.test) {
                        //非测试消息，修改一下消息的类型,并保存修改后的消息记录
                        messageRecord.contentType = ContentType.IMAGE
                        messageRecord.msgStatus = MsgStatus.success
                        messageRecord.media = imageUrl
                        assistantMsgRecordMapper.updateById(messageRecord)
                        redisTemplate.delete(redisKey)
                        this.updateImageUrl(messageRecord)
                    }
                }
            }
        }
    }

    private fun updateImageUrl(messageRecord: MessageRecord) {
        executorService.execute {
            try {
                val path = URLUtil.getPath(messageRecord.media)
                messageRecord.media = fileUploadService.uploadFile(
                    messageRecord.media!!, FileUtil.getSuffix(path), FileUtil.getMimeType(path), "images"
                )
                messageRecordMapper.updateById(messageRecord)
            } catch (e: Exception) {
                StaticLog.error("上传图片链接")
                StaticLog.error(e)
            }
        }
    }

    private fun updateImageUrl(messageRecord: AssistantMsgRecord) {
        executorService.execute {
            try {
                val path = URLUtil.getPath(messageRecord.media)
                messageRecord.media = fileUploadService.uploadFile(
                    messageRecord.media!!, FileUtil.getSuffix(path), FileUtil.getMimeType(path), "images"
                )
                assistantMsgRecordMapper.updateById(messageRecord)
            } catch (e: Exception) {
                StaticLog.error("上传图片链接")
                StaticLog.error(e)
            }
        }
    }

    @Async
    override fun replyAssistantMsg(
        assistant: Assistant,
        prompt: String,
        messageRecord: AssistantMsgRecord,
        user: String,
        userAssistant: UserAssistant,
        baseMessageStr: String?,
        digitHuman: Boolean?,
        messageRecords: List<AssistantMsgRecord>
    ) {
        val baseMessageDTO = JSONUtil.toBean(baseMessageStr, BaseMessageDTO::class.java)
        //预生成消息
        val replyMessageRecord = AssistantMsgRecord().apply {
            this.assistantId = assistant.id
            this.userId = userAssistant.userId
            this.assistantGender = userAssistant.gender
            this.textContent = ""
            this.sourceType = SourceTypeEnum.assistant
            this.contentType = ContentType.TEXT
            this.replyMessageId = messageRecord.id
            this.digitHuman = messageRecord.digitHuman
            this.msgStatus = MsgStatus.created
            this.creatorName = baseMessageDTO.username
        }
        //非测试消息非数字人消息则保存消息内容到数据库
        if (!baseMessageDTO.test) {
            assistantMsgRecordMapper.insert(replyMessageRecord)
            messageRecord.readFlag = true
            messageRecord.readTime = LocalDateTime.now()
            assistantMsgRecordMapper.updateById(messageRecord)
        } else {
            replyMessageRecord.id = System.currentTimeMillis()
        }
        //获取用户聊天的消息体
        var chatMessageBO = this.createChatMessageBO(replyMessageRecord)
        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))

        executorService.execute {
            chatMessageBO.msgStatus = MsgStatus.processing
            this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))

            val expression: String?
            val generateImage: Boolean?
            val assistingImage: Boolean?
            val imagePrompt: String?
//            val recommendChatBot: Boolean?
//            val recommendChatBotTags: String?
            val recommendChatStory: Boolean?
            val recommendChatStoryTags: String?
            try {
                if (messageRecord.contentType == ContentType.IMAGE) {
                    Assert.notBlank(messageRecord.media, "图片链接请赋值给media字段")
                    replyMessageRecord.textContent =
                        imageService.imageToText(messageRecord.textContent, messageRecord.media!!)
                    replyMessageRecord.msgStatus = MsgStatus.success
                    if (!baseMessageDTO.test) {
                        assistantMsgRecordMapper.updateById(replyMessageRecord)
                    }
                    chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                    this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    return@execute
                }

                //发送消息给gpt，并得到响应
                val respJson = getChatgptMessage(messageRecords, prompt)
                replyMessageRecord.formatAssistantMsg = respJson
                //提前gpt的回答
                var answer = respJson.getStr("answer")
                //是否有规则配置得回复生效并将规则为true的规则筛选出来
                val rules = assistant.rules!!.filter {
                    return@filter respJson.getBool(it.key, false)
                }.toList()
                if (CollUtil.isNotEmpty(rules)) {
                    val rule = rules.maxByOrNull { it.rule!!.weight!! }
                    if (Objects.nonNull(rule)) {
                        if (StrUtil.isNotBlank(rule!!.rule!!.answer)) {
                            answer = rule.rule!!.answer
                        }
                    }
                }
                replyMessageRecord.textContent = answer
                replyMessageRecord.msgStatus = MsgStatus.processing
                if (!baseMessageDTO.test) {
                    assistantMsgRecordMapper.updateById(replyMessageRecord)
                }
                chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))

                replyMessageRecord.formatAssistantMsg = respJson
                val redisKey = "${RedisConst.assistantMsgRecordListKey}:${assistant.id}:${replyMessageRecord.userId}"
                val rightPush = redisTemplate.opsForList().rightPush(redisKey, JSONUtil.toJsonStr(replyMessageRecord))
                //若超过长度，则移除最早的历史消息
                if (rightPush!! > chatHistoryLength) {
                    for (i in 0 until rightPush - chatHistoryLength) {
                        redisTemplate.opsForList().leftPop(redisKey)
                    }
                }
                expression = respJson.getStr("expression") ?: "neutral"
                generateImage = respJson.getBool("generateImage", false)
                assistingImage = respJson.getBool("assistingImage", false)
                imagePrompt = respJson.getStr("imagePrompt")
//                recommendChatBot = respJson.getBool("recommendChatBot", false)
//                recommendChatBotTags = respJson.getStr("recommendChatBotTags")
                recommendChatStory = respJson.getBool("recommendChatStory", false)
                recommendChatStoryTags = respJson.getStr("recommendChatStoryTags")
            } catch (e: Exception) {
                replyMessageRecord.msgStatus = MsgStatus.fail
                replyMessageRecord.textContent = "The assistant did not understand your message, please try again"
                if (!baseMessageDTO.test) {
                    assistantMsgRecordMapper.updateById(replyMessageRecord)
                }
                this.respChatMsg(user, baseMessageDTO.chatMsgResp(this.createChatMessageBO(replyMessageRecord)))
                StaticLog.error("生成gpt消息异常")
                StaticLog.error(e)
                return@execute
            }
            //新增数字人功能开关
            if (digitHuman == true && digitHumanSwitch == true) {
                try {
                    StaticLog.debug("查询数字人配置，生成视频....")
                    //查询该机器人数字人配置
                    val humanProfile = humanProfileService.manageDigitalHumanProfileDetail(
                        ProfileType.assistant, replyMessageRecord.assistantId!!, userAssistant.gender
                    )
//                    val voice = this.getVoice(language, humanProfile)
                    val voiceNmae = if (StrUtil.isNotBlank(humanProfile.voiceName)) {
                        humanProfile.voiceName!!
                    } else {
                        if (userAssistant.gender == Gender.FEMALE) {
                            "nova"
                        } else {
                            "onyx"
                        }
                    }
                    StaticLog.debug("最终获取到的音色：{}", voiceNmae)
                    //1.生成语音
                    val audioUrl = ttsService.tts(replyMessageRecord.textContent!!, voiceNmae, UploadType.did)
                    replyMessageRecord.media = audioUrl
                    if (!baseMessageDTO.test) {
                        assistantMsgRecordMapper.updateById(replyMessageRecord)
                    }
                    try {
                        //2.生成视频
                        val generateVideo = didService.generateVideo(
                            humanProfile.sourceImage!!,
                            audioUrl,
                            expression,
                            humanProfile.intensity!!,
                            GenerateType.assistantChat.name
                        )

                        val id = generateVideo.getStr("id")
                        replyMessageRecord.digitHuman = true
                        replyMessageRecord.msgStatus = MsgStatus.processing
                        replyMessageRecord.videoStatus = VideoStatus.created
                        //缓存视频任务，等待视频生成完成时，通过webhook处理后续逻辑
                        this.cacheMessageInfo("$chatVideKey:$id", user, replyMessageRecord, baseMessageDTO)
                        redisTemplate.opsForValue()
                            .increment("${RedisConst.userVideoGenerateNum}:${messageRecord.userId}")
                    } catch (e: Exception) {
                        //消息回复本身可以认为是成功了
                        replyMessageRecord.msgStatus = MsgStatus.success
                        //视频生成失败
                        replyMessageRecord.videoStatus = VideoStatus.fail
                        StaticLog.error("助手回复聊天消息，调用did生成视频服务api异常，异常信息：{}", e.message)
                    }
                    if (!baseMessageDTO.test) {
                        assistantMsgRecordMapper.updateById(replyMessageRecord)
                    }

                    chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                    this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    StaticLog.debug("查询数字人配置生成视频created....")
                } catch (e: Exception) {
                    replyMessageRecord.msgStatus = MsgStatus.fail
                    replyMessageRecord.textContent = "The assistant did not understand your message, please try again"
                    if (!baseMessageDTO.test) {
                        assistantMsgRecordMapper.updateById(replyMessageRecord)
                    }
                    chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                    this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    StaticLog.error("助手生成视频失败异常")
                    StaticLog.error(e)
                }
            }
            if (replyMessageRecord.msgStatus == MsgStatus.processing) {
                replyMessageRecord.msgStatus = MsgStatus.success
                if (digitHuman == true && digitHumanSwitch == true) {
                    replyMessageRecord.videoStatus = VideoStatus.processing
                }
                if (!baseMessageDTO.test) {
                    assistantMsgRecordMapper.updateById(replyMessageRecord)
                }
                chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                //清空后续无用参数
                replyMessageRecord.videoStatus = null
            }
            //判断是否需要生成图片
            if (generateImage) {
                val assistantMsgRecord = BeanUtil.copyProperties(replyMessageRecord, AssistantMsgRecord::class.java)
                try {
                    if (chatMessageBO.msgStatus == MsgStatus.success) {
                        assistantMsgRecord.id = null
                        assistantMsgRecord.textContent = imagePrompt
                        assistantMsgRecord.contentType = ContentType.IMAGE
                        assistantMsgRecord.digitHuman = false
                        assistantMsgRecord.msgStatus = MsgStatus.created
                        if (!baseMessageDTO.test) {
                            assistantMsgRecordMapper.insert(assistantMsgRecord)
                        } else {
                            assistantMsgRecord.id = System.currentTimeMillis()
                        }
                    } else {
                        assistantMsgRecord.msgStatus = MsgStatus.processing
                        if (!baseMessageDTO.test) {
                            assistantMsgRecordMapper.updateById(assistantMsgRecord)
                        }
                    }
                    chatMessageBO = this.createChatMessageBO(assistantMsgRecord)
                    this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    StaticLog.debug("该机器人开始生成图片....")
                    if (assistingImage) {
                        val imageUrl =
                            if (userAssistant.gender == Gender.FEMALE) assistant.femaleAvatar else assistant.femaleAvatar
                        assistantMsgRecord.msgStatus = MsgStatus.success
                        assistantMsgRecord.contentType = ContentType.IMAGE
                        assistantMsgRecord.media = imageUrl
                        if (!baseMessageDTO.test) {
                            assistantMsgRecordMapper.updateById(assistantMsgRecord)
                        }
                    } else {
                        StaticLog.debug("这里处理生成图片逻辑，prompt:$imagePrompt")
                        val imageUrl = imageService.textToImage(imagePrompt)
                        if (StrUtil.isNotBlank(imageUrl)) {
                            assistantMsgRecord.msgStatus = MsgStatus.success
                            assistantMsgRecord.contentType = ContentType.IMAGE
                            assistantMsgRecord.media = imageUrl
                            if (!baseMessageDTO.test) {
                                assistantMsgRecordMapper.updateById(assistantMsgRecord)
                            }
                        } else {
                            //返回异常信息，啥也不做
                            assistantMsgRecord.textContent = "generate image fail"
                            assistantMsgRecord.msgStatus = MsgStatus.fail
                            if (!baseMessageDTO.test) {
                                assistantMsgRecordMapper.updateById(assistantMsgRecord)
                            }
                        }
                    }
                    if (assistantMsgRecord.msgStatus == MsgStatus.success) {
                        this.respChatMsg(
                            user, baseMessageDTO.imageResp(
                                ImageMessageBO(
                                    assistantMsgRecord.id.toString(), assistantMsgRecord.media, "100%", "SUCCESS"
                                )
                            )
                        )
                    }
                    chatMessageBO = this.createChatMessageBO(assistantMsgRecord)
                    this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    if (assistantMsgRecord.msgStatus == MsgStatus.success && !baseMessageDTO.test) {
                        this.updateImageUrl(assistantMsgRecord)
                    }
                } catch (e: Exception) {
                    assistantMsgRecord.textContent = "generate image fail"
                    assistantMsgRecord.msgStatus = MsgStatus.fail
                    if (!baseMessageDTO.test) {
                        assistantMsgRecordMapper.updateById(assistantMsgRecord)
                    }
                    chatMessageBO = this.createChatMessageBO(assistantMsgRecord)
                    this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    StaticLog.error("助手生成图片失败异常")
                    StaticLog.error(e)
                }
            }
            //判断是否推荐故事
            if (recommendChatStory) {
                StaticLog.debug("进入故事推荐逻辑，推荐标签：${recommendChatStoryTags}")
                if (StrUtil.isNotBlank(recommendChatStoryTags)) {
                    val storyRecommend = recommendService.storyRecommend(
                        userAssistant.userId!!, recommendChatStoryTags, assistant.storyRecommendStrategy!!
                    )
                    StaticLog.debug("推荐故事信息:{}", JSONUtil.toJsonStr(storyRecommend))
                    if (Objects.nonNull(storyRecommend)) {
                        val assistantMsgRecord =
                            BeanUtil.copyProperties(replyMessageRecord, AssistantMsgRecord::class.java)
                        if (chatMessageBO.msgStatus == MsgStatus.success) {
                            assistantMsgRecord.id = null
                            assistantMsgRecord.textContent = "recommend story"
                            assistantMsgRecord.digitHuman = false
                            assistantMsgRecord.msgStatus = MsgStatus.created
                            if (!baseMessageDTO.test) {
                                assistantMsgRecordMapper.insert(assistantMsgRecord)
                            } else {
                                assistantMsgRecord.id = System.currentTimeMillis()
                            }
                        } else {
                            assistantMsgRecord.msgStatus = MsgStatus.processing
                        }

                        assistantMsgRecord.contentType = ContentType.storyRecommend
                        chatMessageBO = this.createChatMessageBO(assistantMsgRecord)
                        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))

                        storyRecommend!!.id = storyRecommend.storyId
                        assistantMsgRecord.json = JSONUtil.toJsonStr(storyRecommend)
                        assistantMsgRecord.msgStatus = MsgStatus.success
                        //非测试消息非数字人消息则保存消息内容到数据库
                        if (!baseMessageDTO.test) {
                            assistantMsgRecordMapper.updateById(assistantMsgRecord)
                        }
                        chatMessageBO = this.createChatMessageBO(assistantMsgRecord)
                        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                    }
                }
            }
        }
    }

    override fun botSayHello(user: String, msg: MessageRecord) {
        val baseMessageDTO = BaseMessageDTO().apply {
            this.chatModule = ChatModule.bot
            this.test = false
            this.msgType = MsgType.CHAT_MSG
            this.username = user
            this.msgData = createChatMessageBO(msg)
            this.sessionId = "${msg.userId}-${ChatModule.bot.name}-${msg.botId}"
        }
        this.respChatMsg(user, baseMessageDTO)
    }

    override fun assistantSayHello(user: String, msg: AssistantMsgRecord) {
        val baseMessageDTO = BaseMessageDTO().apply {
            this.chatModule = ChatModule.assistant
            this.test = false
            this.msgType = MsgType.CHAT_MSG
            this.username = user
            this.msgData = createChatMessageBO(msg)
            this.sessionId = "${msg.userId}-${ChatModule.assistant.name}-${msg.assistantId}"
        }
        this.respChatMsg(user, baseMessageDTO)
    }

    override fun regenerateAssistantMsg(
        assistant: Assistant,
        prompt: String,
        replyMessageRecord: AssistantMsgRecord,
        user: String,
        userAssistant: UserAssistant,
        baseMessageStr: String?,
        digitHuman: Boolean?,
        messageRecords: List<AssistantMsgRecord>
    ) {
        val baseMessageDTO = JSONUtil.toBean(baseMessageStr, BaseMessageDTO::class.java)
        //获取用户聊天的消息体
        var chatMessageBO = this.createChatMessageBO(replyMessageRecord)
        chatMessageBO.msgStatus = MsgStatus.processing
        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
        executorService.execute {
            try {
                //chatgpt返回信息
                val respJson = getChatgptMessage(messageRecords, prompt)

                //提前gpt的回答
                var answer = respJson.getStr("answer")
                //是否有规则配置得回复生效并将规则为true的规则筛选出来
                val rules = assistant.rules!!.filter {
                    return@filter respJson.getBool(it.key, false)
                }.toList()
                if (CollUtil.isNotEmpty(rules)) {
                    val rule = rules.maxByOrNull { it.rule!!.weight!! }
                    if (Objects.nonNull(rule)) {
                        if (StrUtil.isNotBlank(rule!!.rule!!.answer)) {
                            answer = rule.rule!!.answer
                        }
                    }
                }
                replyMessageRecord.regenerateNum = (replyMessageRecord.regenerateNum ?: 0) + 1
                replyMessageRecord.textContent = answer
                replyMessageRecord.badAnswer = false //重置错误回答标识

                val expression = respJson.getStr("expression") ?: "neutral"
                val generateImage = respJson.getBool("generateImage", false)
                val assistingImage = respJson.getBool("assistingImage", false)
                val imagePrompt = respJson.getStr("imagePrompt")
                val recommendChatStory = respJson.getBool("recommendChatStory", false)
                val recommendChatStoryTags = respJson.getStr("recommendChatStoryTags")

                if (replyMessageRecord.digitHuman == true) {
                    StaticLog.debug("查询数字人配置，生成视频....")
                    //查询该机器人数字人配置
                    val humanProfile = humanProfileService.manageDigitalHumanProfileDetail(
                        ProfileType.assistant, replyMessageRecord.assistantId!!, userAssistant.gender
                    )
                    val voiceNmae = if (StrUtil.isNotBlank(humanProfile.voiceName)) {
                        humanProfile.voiceName!!
                    } else {
                        if (userAssistant.gender == Gender.FEMALE) {
                            "nova"
                        } else {
                            "onyx"
                        }
                    }
                    StaticLog.debug("最终获取到的音色：{}", voiceNmae)
                    //1.生成语音
                    val audioUrl = ttsService.tts(replyMessageRecord.textContent!!, voiceNmae, UploadType.did)
                    replyMessageRecord.media = audioUrl
                    if (!baseMessageDTO.test) {
                        assistantMsgRecordMapper.updateById(replyMessageRecord)
                    }
                    try {
                        //2.生成视频
                        val generateVideo = didService.generateVideo(
                            humanProfile.sourceImage!!,
                            audioUrl,
                            expression,
                            humanProfile.intensity!!,
                            GenerateType.assistantChat.name
                        )

                        val id = generateVideo.getStr("id")
                        replyMessageRecord.digitHuman = true
                        replyMessageRecord.msgStatus = MsgStatus.processing
                        replyMessageRecord.videoStatus = VideoStatus.created
                        //缓存视频任务，等待视频生成完成时，通过webhook处理后续逻辑
                        this.cacheMessageInfo("$chatVideKey:$id", user, replyMessageRecord, baseMessageDTO)
                        redisTemplate.opsForValue()
                            .increment("${RedisConst.userVideoGenerateNum}:${replyMessageRecord.userId}")
                        assistantMsgRecordMapper.updateById(replyMessageRecord)
                        chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                        StaticLog.debug("查询数字人配置生成视频created....")
                    } catch (e: Exception) {
                        replyMessageRecord.msgStatus = MsgStatus.fail
                        replyMessageRecord.textContent =
                            "The assistant did not understand your message, please try again"
                        if (!baseMessageDTO.test) {
                            assistantMsgRecordMapper.updateById(replyMessageRecord)
                        }
                        chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                        StaticLog.error("助手生成视频失败异常")
                        StaticLog.error(e)
                    }
                    return@execute
                }
                //判断是否需要生成图片
                if (generateImage) {
                    try {
                        replyMessageRecord.contentType = ContentType.IMAGE
                        replyMessageRecord.digitHuman = false
                        replyMessageRecord.msgStatus = MsgStatus.processing
                        assistantMsgRecordMapper.updateById(replyMessageRecord)
                        chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                        StaticLog.debug("该机器人开始生成图片....")
                        if (assistingImage) {
                            val imageUrl =
                                if (userAssistant.gender == Gender.FEMALE) assistant.femaleAvatar else assistant.femaleAvatar
                            replyMessageRecord.msgStatus = MsgStatus.success
                            replyMessageRecord.contentType = ContentType.IMAGE
                            replyMessageRecord.media = imageUrl
                            assistantMsgRecordMapper.updateById(replyMessageRecord)
                        } else {
                            StaticLog.debug("这里处理生成图片逻辑，prompt:$imagePrompt")
                            val imageUrl = imageService.textToImage(imagePrompt)
                            if (StrUtil.isNotBlank(imageUrl)) {
                                replyMessageRecord.msgStatus = MsgStatus.success
                                replyMessageRecord.contentType = ContentType.IMAGE
                                replyMessageRecord.media = imageUrl
                                assistantMsgRecordMapper.updateById(replyMessageRecord)
                            } else {
                                //返回异常信息，啥也不做
                                replyMessageRecord.textContent = "generate image fail"
                                replyMessageRecord.msgStatus = MsgStatus.fail
                                assistantMsgRecordMapper.updateById(replyMessageRecord)
                            }
                        }
                        if (replyMessageRecord.msgStatus == MsgStatus.success) {
                            this.respChatMsg(
                                user, baseMessageDTO.imageResp(
                                    ImageMessageBO(
                                        replyMessageRecord.id.toString(), replyMessageRecord.media, "100%", "SUCCESS"
                                    )
                                )
                            )
                        }
                        chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                        if (replyMessageRecord.msgStatus == MsgStatus.success && !baseMessageDTO.test) {
                            this.updateImageUrl(replyMessageRecord)
                        }
                    } catch (e: Exception) {
                        replyMessageRecord.textContent = "generate image fail"
                        replyMessageRecord.msgStatus = MsgStatus.fail
                        assistantMsgRecordMapper.updateById(replyMessageRecord)
                        chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                        StaticLog.error("助手生成图片失败异常")
                        StaticLog.error(e)
                    }
                    return@execute
                }
                //判断是否推荐故事
                if (recommendChatStory) {
                    StaticLog.debug("进入故事推荐逻辑，推荐标签：${recommendChatStoryTags}")
                    if (StrUtil.isNotBlank(recommendChatStoryTags)) {
                        val storyRecommend = recommendService.storyRecommend(
                            userAssistant.userId!!, recommendChatStoryTags, assistant.storyRecommendStrategy!!
                        )
                        StaticLog.debug("推荐故事信息:{}", JSONUtil.toJsonStr(storyRecommend))
                        if (Objects.nonNull(storyRecommend)) {
                            replyMessageRecord.digitHuman = false
                            replyMessageRecord.msgStatus = MsgStatus.processing
                            assistantMsgRecordMapper.updateById(replyMessageRecord)
                            replyMessageRecord.contentType = ContentType.storyRecommend
                            chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                            this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))

                            storyRecommend!!.id = storyRecommend.storyId
                            replyMessageRecord.json = JSONUtil.toJsonStr(storyRecommend)
                            replyMessageRecord.msgStatus = MsgStatus.success
                            //非测试消息非数字人消息则保存消息内容到数据库
                            assistantMsgRecordMapper.updateById(replyMessageRecord)
                            chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                            this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
                        }
                    }
                    return@execute
                }
                replyMessageRecord.msgStatus = MsgStatus.success
                assistantMsgRecordMapper.updateById(replyMessageRecord)
                chatMessageBO = this.createChatMessageBO(replyMessageRecord)
                this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
            } catch (e: Exception) {
                replyMessageRecord.msgStatus = MsgStatus.fail
                replyMessageRecord.textContent = "The assistant did not understand your message, please try again"
                assistantMsgRecordMapper.updateById(replyMessageRecord)
                this.respChatMsg(user, baseMessageDTO.chatMsgResp(this.createChatMessageBO(replyMessageRecord)))
                StaticLog.error(e)
            }
        }
    }

    @Async
    override fun replyGameMessage(messageRecord: GameMessageRecord, user: String, baseMessageDTO: BaseMessageDTO) {
        //1.查询游戏线程记录(messageRecord.threadId)
        val gameThread = gameService.getGameThread(messageRecord.threadId!!)
        //记录消息已读
        messageRecord.readFlag = true
        messageRecord.readTime = LocalDateTime.now()
        messageRecord.gameQuestion = false   //默认false
        messageRecord.gameStatus = gameThread.status
        gameMessageRecordMapper.updateById(messageRecord)
        //返回回复消息
        val replyMessageRecord = GameMessageRecord().apply {
            this.threadId = messageRecord.threadId
            this.userId = messageRecord.userId
            this.contentType = ContentType.TEXT
            this.sourceType = SourceTypeEnum.game
            this.textContent = ""
            this.msgStatus = MsgStatus.created
            this.readFlag = false
            this.gameQuestion = false
            this.gameStatus = gameThread.status
            this.creator = messageRecord.userId
            this.createdAt = LocalDateTime.now()
            this.replyMessageId = messageRecord.id
        }
        gameMessageRecordMapper.insert(replyMessageRecord)
        //推送消息创建成功
        var chatMessageBO = this.createChatMessageBO(replyMessageRecord)
        this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
        try {
            //未完成游戏的情况
            if (gameThread.status == GameStatus.UNCOMPLETED) {
                //获取当前游戏问题
                val currentQuestion = gameService.getCurrentGameQuestion(gameThread.id)
                StaticLog.debug("当前游戏问题：{}", JSONUtil.toJsonStr(currentQuestion))
                //若已开始第一个问题，则直接推送游戏第一个问题
                if (currentQuestion.bof) {
                    val nextQuestion = gameService.getGameNextQuestion(gameThread.id)
                    StaticLog.debug("当前未开始游戏，获取游戏第一个问题：{}", JSONUtil.toJsonStr(nextQuestion))
                    replyMessageRecord.contentType = ContentType.md
                    replyMessageRecord.textContent = nextQuestion.question
                    replyMessageRecord.gameQuestion = true
                    replyMessageRecord.msgStatus = MsgStatus.success
                } else {
                    //判断用户消息是否为当前游戏问题的回答内容
                    val questionGuidance = gameAiAssistantService.checkGameQuestionAnswer(
                        currentQuestion.question!!,
                        messageRecord.textContent!!,
                        gameThread.gameId!!,
                        baseMessageDTO.communicationStyle
                    )
                    StaticLog.debug("用户问题是否为当前问题的答案：{}", JSONUtil.toJsonStr(questionGuidance))
                    //引导语不为空，则返回引导语，说明用户的回答不是对应问题的回复
                    if (StrUtil.isNotBlank(questionGuidance)) {
                        replyMessageRecord.textContent = questionGuidance
                        replyMessageRecord.msgStatus = MsgStatus.success
                    }
                    //标记用户消息为当前问题的回复
                    else {
                        messageRecord.gameQuestion = true   //默认true
                    }
                }
                //用户消息是回复的游戏问题 且 当前问题不是最后一个问题，则获取游戏下一个问题
                if (messageRecord.gameQuestion == true && !currentQuestion.eof) {
                    val nextQuestion = gameService.getGameNextQuestion(gameThread.id)
                    replyMessageRecord.contentType = ContentType.md
                    replyMessageRecord.textContent = nextQuestion.question
                    replyMessageRecord.gameQuestion = true
                    replyMessageRecord.msgStatus = MsgStatus.success
                }
                //用户消息是回复的游戏问题 且 当前问题是最后一个问题，则匹配游戏结果
                if (messageRecord.gameQuestion == true && currentQuestion.eof) {
                    val gameResult =
                        gameAiAssistantService.matchGameResult(messageRecord.threadId!!, messageRecord.userId!!)
                    replyMessageRecord.contentType = ContentType.gameResult
                    replyMessageRecord.json = JSONUtil.toJsonStr(gameResult)
                    replyMessageRecord.gameQuestion = true
                    replyMessageRecord.msgStatus = MsgStatus.success
                    replyMessageRecord.gameStatus = GameStatus.COMPLETE
                }
            }
            //已完成，返回正常聊天响应
            else {
                //正常聊天内容返回
                replyMessageRecord.textContent = gameAiAssistantService.completeGameChatMsg(
                    gameThread.gameId, gameThread.id, messageRecord.userId!!, baseMessageDTO.communicationStyle
                )
                replyMessageRecord.msgStatus = MsgStatus.success
            }
        } catch (e: Exception) {
            StaticLog.error("用户问题：{}，返回异常：{}", messageRecord.textContent, e.message)
            replyMessageRecord.textContent = "Message processing failed"
            replyMessageRecord.msgStatus = MsgStatus.fail
        } finally {
            if (replyMessageRecord.msgStatus == MsgStatus.created) {
                replyMessageRecord.textContent = "Message processing failed"
                replyMessageRecord.msgStatus = MsgStatus.fail
            }
            gameMessageRecordMapper.updateById(replyMessageRecord)
            chatMessageBO = this.createChatMessageBO(replyMessageRecord)
            this.respChatMsg(user, baseMessageDTO.chatMsgResp(chatMessageBO))
        }
    }


    private fun getChatgptMessage(messageRecords: List<AssistantMsgRecord>, prompt: String): JSONObject {
        //发送消息给gpt，并得到响应
        val chatmessages = messageRecords.filter {
            StrUtil.isNotBlank(it.textContent)
        }.map {
            if (it.sourceType == SourceTypeEnum.user) {
                ChatMessage("user", it.textContent!!)
            } else {
                if (Objects.isNull(it.formatAssistantMsg)) {
                    it.formatAssistantMsg = JSONObject().apply {
                        this["recommendChatStory"] = false
                        this["recommendChatStoryTags"] = ""
                        this["recommendChatBot"] = false
                        this["recommendChatBotTags"] = ""
                        this["expression"] = "neutral"
                        this["generateImage"] = false
                        this["assistingImage"] = false
                        this["imagePrompt"] = ""
                        this["answer"] = it.textContent
                    }
                }
                ChatMessage("assistant", JSONUtil.toJsonStr(it.formatAssistantMsg))
            }
        }
        val msgResp = gptClient.send(prompt, chatmessages = chatmessages)
        StaticLog.debug("assistant chatGpt响应消息：$msgResp")
        return JSONObject(msgResp)
    }

    private fun createChatMessageBO(messageRecord: AssistantMsgRecord): ChatMessageBO {
        val chatMessageBO = ChatMessageBO()
        chatMessageBO.objectId = messageRecord.assistantId.toString()
        chatMessageBO.userId = messageRecord.userId.toString()
        chatMessageBO.contentType = messageRecord.contentType
        chatMessageBO.textContent = messageRecord.textContent
        chatMessageBO.media = messageRecord.media
        chatMessageBO.json = messageRecord.json
        chatMessageBO.fileProperty = messageRecord.fileProperty
        chatMessageBO.msgId = messageRecord.id.toString()
        chatMessageBO.replyMessageId = messageRecord.replyMessageId
        chatMessageBO.sourceType = messageRecord.sourceType
        chatMessageBO.createdAt = messageRecord.createdAt
        chatMessageBO.msgStatus = messageRecord.msgStatus
        chatMessageBO.digitHuman = messageRecord.digitHuman
        chatMessageBO.videoStatus = messageRecord.videoStatus
        chatMessageBO.videoUrl = messageRecord.videoUrl
        return chatMessageBO
    }

    private fun createChatMessageBO(messageRecord: MessageRecord): ChatMessageBO {
        val chatMessageBO = ChatMessageBO()
        chatMessageBO.objectId = messageRecord.botId.toString()
        chatMessageBO.userId = messageRecord.userId.toString()
        chatMessageBO.contentType = messageRecord.contentType
        chatMessageBO.textContent = messageRecord.textContent
        chatMessageBO.media = messageRecord.media
        chatMessageBO.fileProperty = messageRecord.fileProperty
        chatMessageBO.msgId = messageRecord.id.toString()
        chatMessageBO.replyMessageId = messageRecord.replyMessageId
        chatMessageBO.sourceType = messageRecord.sourceType
        chatMessageBO.createdAt = messageRecord.createdAt
        chatMessageBO.msgStatus = messageRecord.msgStatus
        chatMessageBO.json = messageRecord.json
        return chatMessageBO
    }

    override fun createChatMessageBO(messageRecord: GameMessageRecord): ChatMessageBO {
        val chatMessageBO = ChatMessageBO()
        chatMessageBO.objectId = messageRecord.threadId.toString()
        chatMessageBO.userId = messageRecord.userId.toString()
        chatMessageBO.contentType = messageRecord.contentType
        chatMessageBO.json = messageRecord.json
        chatMessageBO.textContent = messageRecord.textContent
        chatMessageBO.media = messageRecord.media
        chatMessageBO.fileProperty = messageRecord.fileProperty
        chatMessageBO.msgId = messageRecord.id.toString()
        chatMessageBO.replyMessageId = messageRecord.replyMessageId
        chatMessageBO.sourceType = messageRecord.sourceType
        chatMessageBO.createdAt = messageRecord.createdAt
        chatMessageBO.msgStatus = messageRecord.msgStatus
        chatMessageBO.gameStatus = messageRecord.gameStatus
        return chatMessageBO
    }

    private fun cacheMessageInfo(
        redisKey: String, user: String, messageRecord: Any, baseMessageDTO: BaseMessageDTO
    ) {
        redisTemplate.opsForHash<String, String>().put(redisKey, "user", user)
        redisTemplate.opsForHash<String, String>().put(redisKey, "messageRecord", JSONUtil.toJsonStr(messageRecord))
        redisTemplate.opsForHash<String, String>().put(redisKey, "baseMessage", JSONUtil.toJsonStr(baseMessageDTO))
        redisTemplate.expire(redisKey, 1, TimeUnit.DAYS)
    }
}