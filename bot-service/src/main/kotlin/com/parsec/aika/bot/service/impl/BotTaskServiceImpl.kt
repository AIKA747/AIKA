package com.parsec.aika.bot.service.impl

import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.cronutils.model.CronType
import com.cronutils.model.definition.CronDefinitionBuilder
import com.cronutils.parser.CronParser
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.gpt.GptClient
import com.parsec.aika.bot.remote.UserFeignClient
import com.parsec.aika.bot.service.BotTaskService
import com.parsec.aika.bot.service.ChatService
import com.parsec.aika.bot.service.RabbitMessageService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.MessageRecordMapper
import com.parsec.aika.common.mapper.UserBotTaskLogsMapper
import com.parsec.aika.common.mapper.UserBotTaskMapper
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.entity.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import com.parsec.trantor.redis.annotation.RedisLock
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import javax.annotation.Resource

@Service
class BotTaskServiceImpl : BotTaskService {

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var userBotTaskMapper: UserBotTaskMapper

    @Resource
    private lateinit var messageRecordMapper: MessageRecordMapper

    @Resource
    private lateinit var chatService: ChatService

    @Resource
    private lateinit var rabbitMessageService: RabbitMessageService

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    @Resource
    private lateinit var gptClient: GptClient

    @Resource
    private lateinit var userBotTaskLogsMapper: UserBotTaskLogsMapper

    override fun getBotTaskList(
        pageNo: Int, pageSize: Int, botId: Long?, user: LoginUserInfo
    ): PageResult<UserBotTask>? {
        PageHelper.startPage<UserBotTask>(pageNo, pageSize)
        val list = userBotTaskMapper.selectList(
            KtQueryWrapper(UserBotTask::class.java).eq(botId != null, UserBotTask::botId, botId)
                .eq(UserBotTask::creater, user.userId).orderByDesc(UserBotTask::createdAt)
        )
        return PageUtil<UserBotTask>().page(list)
    }

    override fun getBotTaskDetail(id: Int): UserBotTask {
        return userBotTaskMapper.selectById(id) ?: throw BusinessException("task is not fund")
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun putBotTaskStatus(id: Int, status: BotTaskStatus, cron: String?, user: LoginUserInfo?): UserBotTask? {
        val userBotTask = getBotTaskDetail(id)
        //更新消息中的任务状态
        if (userBotTask.status != status && (userBotTask.type != BotTaskType.WEBSEARCH || userBotTask.type == BotTaskType.EXECUTEONCE)) {
            userBotTaskMapper.updateBotMessageObjTaskStatus(id, status)
        }
        userBotTask.status = status
        if (userBotTask.type != BotTaskType.EXECUTEONCE) {
            if (StrUtil.isNotBlank(cron)) {
                // 校验 cron 表达式
                val cronDefinition = CronDefinitionBuilder.instanceDefinitionFor(CronType.QUARTZ)
                val parser = CronParser(cronDefinition)
                try {
                    parser.parse(cron)
                } catch (e: Exception) {
                    throw BusinessException("Invalid cron expression: ${e.message}")
                }
                userBotTask.cron = cron
            }
            if (status == BotTaskStatus.ENABLED && StrUtil.isNotBlank(userBotTask.cron)) {
                val createBotUserTask = userFeignClient.createBotUserTask(userBotTask.id!!, userBotTask.cron!!)
                StaticLog.info("开启机器人任务：{}", JSONUtil.toJsonStr(createBotUserTask))
                Assert.state(createBotUserTask.isSuccess, createBotUserTask.msg)
            }
        }
        val updateById = userBotTaskMapper.updateById(userBotTask)
        if (updateById > 0 && status == BotTaskStatus.ENABLED && userBotTask.type == BotTaskType.EXECUTEONCE) {
            this.executeTask(id)
        }
        return userBotTask
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun deleteBotTask(id: Int): Int? {
        userBotTaskMapper.deleteBotMessageObjTask(id)
        return userBotTaskMapper.deleteById(id)
    }

    override fun closeBotTask(userId: Long?, botId: Long?) {
//        StaticLog.info("关闭机器人任务：{}-{}", userId, botId)
        val task = userBotTaskMapper.selectEnabledTask(userId, botId)
//        StaticLog.info("关闭机器人任务：{}", JSONUtil.toJsonStr(task))
        if (task != null) {
            this.putBotTaskStatus(task.id!!, BotTaskStatus.DISABLED)
        }
    }

    @RedisLock(name = "executeTask", keys = ["#taskId"])
    override fun executeTask(taskId: Int) {
        val botTaskLogs = UserBotTaskLogs().apply {
            this.taskId = taskId
            this.excutedAt = LocalDateTime.now()
            this.success = true
        }
        try {
            //查询任务
            val botTask =
                userBotTaskMapper.selectById(taskId) ?: throw BusinessException(BotPostResultCode.BOT_TASK_DISABLED)
            botTaskLogs.taskCron = botTask.cron
            if (botTask.status != BotTaskStatus.ENABLED && botTask.type != BotTaskType.EXECUTEONCE) {
                throw BusinessException(BotPostResultCode.BOT_TASK_DISABLED)
            }
            val bot = botMapper.selectById(botTask.botId) ?: throw BusinessException(BotPostResultCode.BOT_NOT_EXIST)
            if (bot.botStatus != BotStatusEnum.online) {
                throw BusinessException(BotPostResultCode.BOT_NOT_ONLINE)
            }
            if (botTask.executeLimit != null && botTask.executeLimit!! > 0) {
                //查询任务执行次数
                val selectCount = userBotTaskLogsMapper.selectCount(
                    KtQueryWrapper(UserBotTaskLogs::class.java).eq(UserBotTaskLogs::taskId, taskId)
                )
                if (selectCount >= botTask.executeLimit!!) {
                    botTaskLogs.failMsg = "The task has been completed."
                    this.putBotTaskStatus(taskId, BotTaskStatus.DISABLED)

                    throw BusinessException(BotPostResultCode.BOT_TASK_DISABLED)
                }
            }
            if (botTask.type != BotTaskType.REMINDER) {
                botTask.message = gptClient.webSearch(botTask.prompt)
                StaticLog.info("webSearch 返回信息:{}", botTask.message)
            }
            //查询用户信息
            val userInfo = userFeignClient.userInfo(botTask.creater!!)
            // 保存会话
            val msg = MessageRecord().apply {
                this.botId = botTask.botId
                this.userId = botTask.creater
                this.sourceType = SourceTypeEnum.bot
                this.contentType = ContentType.md
                this.readFlag = false
                this.textContent = (botTask.message
                    ?: "Just a reminder") + ", If you don't need this reminder, you can ask me to cancel this reminder task now."
                this.msgStatus = MsgStatus.success
                this.creator = userId
                this.creatorName = userInfo?.username
                this.createdAt = LocalDateTime.now()
            }
            //保存消息
            messageRecordMapper.insert(msg)
            //推送mqtt消息
            chatService.botSayHello("${UserTypeEnum.APPUSER.name}${botTask.creater}", msg)
            // 发送mq,firebase推送消息
            rabbitMessageService.sayHello(
                botTask.creater!!,
                bot.botName!!,
                botTask.message ?: "Received a new message",
                ChatModule.bot,
                userInfo?.username,
                msg.botId!!,
                bot.avatar
            )
            botTask.message = msg.textContent
            //更新任务最新执行时间
            botTask.lastExcetedAt = LocalDateTime.now()
            userBotTaskMapper.updateById(botTask)
        } catch (e: Exception) {
            botTaskLogs.success = false
            if (StrUtil.isBlank(botTaskLogs.failMsg)) {
                botTaskLogs.failMsg = e.message ?: "system error"
            }
            throw e
        } finally {
            botTaskLogs.excutedEndAt = LocalDateTime.now()
            botTaskLogs.executeTime =
                LocalDateTimeUtil.between(botTaskLogs.excutedAt, botTaskLogs.excutedEndAt, ChronoUnit.MILLIS)
            userBotTaskLogsMapper.insert(botTaskLogs)
        }
    }

    override fun getManageBotTaskList(
        pageNo: Int?, pageSize: Int?, status: BotTaskStatus?, minTime: String?, maxTime: String?, user: LoginUserInfo
    ): PageResult<UserBotTask>? {
        PageHelper.startPage<UserBotTask>(pageNo ?: 1, pageSize ?: 10)
        val list = userBotTaskMapper.getManageBotTaskList(status, minTime, maxTime)
        return PageUtil<UserBotTask>().page(list)
    }


}