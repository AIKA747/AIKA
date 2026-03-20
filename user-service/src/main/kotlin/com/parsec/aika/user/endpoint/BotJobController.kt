package com.parsec.aika.user.endpoint

import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.cronutils.model.CronType
import com.cronutils.model.definition.CronDefinitionBuilder
import com.cronutils.parser.CronParser
import com.parsec.aika.user.model.em.JobType
import com.parsec.aika.user.service.JobService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class BotJobController {

    @Resource
    private lateinit var jobService: JobService

    @PostMapping("/fegin/bot/post/task")
    fun createBotPostTask(botId: Long, cron: String): BaseResult<*> {
        // 校验 cron 表达式
        val cronDefinition = CronDefinitionBuilder.instanceDefinitionFor(CronType.QUARTZ)
        val parser = CronParser(cronDefinition)
        try {
            parser.parse(cron)
        } catch (e: Exception) {
            return BaseResult.failure("Invalid cron expression: ${e.message}")
        }
        jobService.addJob(JobType.botPostJob, botId.toString(), "bot_post", cron, JSONObject().apply {
            this.set("botId", botId)
        })
        StaticLog.info("bot[$botId] createBotPostTask success cron:$cron")
        return BaseResult.success()
    }

    @PostMapping("/fegin/bot/user/task")
    fun createBotUserTask(taskId: Int, cron: String): BaseResult<*> {
        // 校验 cron 表达式
        val cronDefinition = CronDefinitionBuilder.instanceDefinitionFor(CronType.QUARTZ)
        val parser = CronParser(cronDefinition)
        try {
            parser.parse(cron)
        } catch (e: Exception) {
            return BaseResult.failure("Invalid cron expression: ${e.message}")
        }
        jobService.addJob(JobType.botUserTaskJob, taskId.toString(), "bot_task", cron, JSONObject().apply {
            this.set("taskId", taskId)
        })
        StaticLog.info("bot task[$taskId] createBotUserTask success cron:$cron")
        return BaseResult.success()
    }


}