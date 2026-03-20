package com.parsec.aika.user.scheduler.job

import cn.hutool.core.date.DateUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.extra.spring.SpringUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.user.model.entity.JobStatus
import com.parsec.aika.user.model.entity.PushJob
import com.parsec.aika.user.service.UserService
import org.quartz.DisallowConcurrentExecution
import org.quartz.JobExecutionContext
import org.quartz.PersistJobDataAfterExecution
import java.time.LocalDateTime

// 持久化
@PersistJobDataAfterExecution
// 禁止并发执行
@DisallowConcurrentExecution
class InactiveUserCheckJob : CommonJob() {

    private var userService: UserService? = null

    override fun execute(context: JobExecutionContext) {
        val data = JSONUtil.toJsonStr(context.jobDetail.jobDataMap)
        StaticLog.info("当前时间：{}，InactiveUserCheckJob execute,data:{}", DateUtil.now(), data)
        if (StrUtil.isNotBlank(data)) {
            val pushJob = JSONUtil.toBean(JSONObject(data).getJSONObject("data"), PushJob::class.java)
            if (null != pushJob) {
                pushJob.status = JobStatus.pending
                pushJob.excuted = true
                pushJob.excutedAt = LocalDateTime.now()
                if (pushJob.body!!.inactiveDays!! > 0) {
                    getUserService()?.pushInactiveUsersNotify(
                        pushJob.body!!.inactiveDays,
                        pushJob.body!!.title,
                        pushJob.body!!.content,
                        pushJob.id,
                        pushJob.operator
                    )
//                    val list = getUserService()?.getInactiveUsers(pushJob.body!!.inactiveDays)
//                    if (!list.isNullOrEmpty()) {
//                        list.forEach {
//                            getPushListService()!!.pushUserNotify(
//                                it, pushJob.operator, pushJob.body!!.title, pushJob.body!!.content, pushJob.id
//                            )
//                        }
//                    }
                }
                getPushJobMapper()?.updateById(pushJob)
            }
        }
    }

    fun getUserService(): UserService? {
        if (null == userService) {
            userService = SpringUtil.getBean(UserService::class.java)
        }
        return userService
    }
}