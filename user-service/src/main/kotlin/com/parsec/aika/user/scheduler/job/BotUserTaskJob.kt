package com.parsec.aika.user.scheduler.job

import cn.hutool.core.date.DateUtil
import cn.hutool.extra.spring.SpringUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.em.BotPostResultCode
import com.parsec.trantor.common.response.BaseResult
import org.quartz.DisallowConcurrentExecution
import org.quartz.JobExecutionContext
import org.quartz.PersistJobDataAfterExecution
import org.springframework.web.client.RestTemplate

// 持久化
@PersistJobDataAfterExecution
// 禁止并发执行
@DisallowConcurrentExecution
class BotUserTaskJob : CommonJob() {

    private var restTemplate: RestTemplate? = null

    private fun getRestTemplate(): RestTemplate? {
        if (null == restTemplate) {
            restTemplate = SpringUtil.getBean(RestTemplate::class.java)
        }
        return restTemplate
    }

    override fun execute(context: JobExecutionContext) {
        val data = JSONUtil.toJsonStr(context.jobDetail.jobDataMap)
        StaticLog.info("当前时间：{}，CronJob execute,data:{}", DateUtil.now(), data)
        val taskId = JSONUtil.getByPath(JSONObject(data), "data.taskId").toString()
        val result = getRestTemplate()?.getForObject(
            "http://aika-bot-service/bot/feign/bot/task/execute?taskId=$taskId", BaseResult::class.java
        )
        StaticLog.info("执行机器人任务结果：{}", JSONUtil.toJsonStr(result))
        if (result?.code == BotPostResultCode.BOT_NOT_ONLINE.code || result?.code == BotPostResultCode.BOT_NOT_EXIST.code || result?.code == BotPostResultCode.BOT_TASK_DISABLED.code) {
            //移除任务
            deleteJob(context)
            StaticLog.info("机器人已离线或已删除，移除任务[{}]", taskId)
        }
    }
}