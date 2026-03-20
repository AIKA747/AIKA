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

// 持久化
@PersistJobDataAfterExecution
// 禁止并发执行
@DisallowConcurrentExecution
class AsyncJob : CommonJob() {

    override fun execute(context: JobExecutionContext) {
        val data = JSONUtil.toJsonStr(context.jobDetail.jobDataMap)
        StaticLog.info("当前时间：{}，AsyncJob execute,data:{}", DateUtil.now(), data)
        if (StrUtil.isNotBlank(data)) {
            val pushJob = JSONUtil.toBean(JSONObject(data).getJSONObject("data"), PushJob::class.java)
            if (null != pushJob) {
                pushJob.status = JobStatus.executed
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
            getSchedulerFactoryBean()?.scheduler?.deleteJob(context.jobDetail.key)
        }
    }
}