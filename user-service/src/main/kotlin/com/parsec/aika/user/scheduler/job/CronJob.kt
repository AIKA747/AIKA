package com.parsec.aika.user.scheduler.job

import cn.hutool.core.date.DateUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.JobStatus
import com.parsec.aika.user.model.entity.PushJob
import com.parsec.aika.user.model.vo.req.PostPushListReq
import org.quartz.DisallowConcurrentExecution
import org.quartz.JobExecutionContext
import org.quartz.PersistJobDataAfterExecution
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

// 持久化
@PersistJobDataAfterExecution
// 禁止并发执行
@DisallowConcurrentExecution
class CronJob : CommonJob() {

    override fun execute(context: JobExecutionContext) {
        val data = JSONUtil.toJsonStr(context.jobDetail.jobDataMap)
        StaticLog.info("当前时间：{}，CronJob execute,data:{}", DateUtil.now(), data)
        if (StrUtil.isNotBlank(data)) {
            val pushJob = JSONUtil.toBean(JSONObject(data).getJSONObject("data"), PushJob::class.java)
            if (null != pushJob) {
                if (StrUtil.isNotBlank(pushJob.body?.stopTime)) {
                    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                    val dateTime = LocalDateTime.parse(pushJob.body?.stopTime, formatter)
                    if (dateTime.isBefore(LocalDateTime.now())) {
                        pushJob.status = JobStatus.executed
                        getPushJobMapper()?.updateById(pushJob)
                        getSchedulerFactoryBean()?.scheduler?.deleteJob(context.jobDetail.key)
                    }
                    return
                }
                pushJob.status = JobStatus.pending
                pushJob.excuted = true
                pushJob.excutedAt = LocalDateTime.now()
                getPushJobMapper()?.updateById(pushJob)
                val pushListReq = JSONUtil.toBean(JSONObject(pushJob.body), PostPushListReq::class.java)
                pushListReq.jobId = pushJob.id
                getPushListService()?.postPushList(pushListReq, LoginUserInfo().apply {
                    this.username = pushJob.operator
                    this.userId = pushJob.creator
                })
            }
        }
    }
}