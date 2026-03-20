package com.parsec.aika.user.scheduler.job

import cn.hutool.extra.spring.SpringUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.user.service.JobService
import com.parsec.aika.user.service.UserService
import org.quartz.Job
import org.quartz.JobExecutionContext
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct
import javax.annotation.Resource

@Component
class DailyJob : Job {

    @Resource
    private lateinit var jobService: JobService

    private var userService: UserService? = null

    @PostConstruct
    fun initJob() {
        //为方便测试，这里设置3秒执行一次，调试好后合并master时需修改为真实执行频率，每天凌晨1点执行 cron："0 0 1 * * ?"
        //不用执行这个方法，舍弃了这个逻辑
//        jobService.addJob(JobType.dailyJob, "dailyJob", "systemJob", "1/3 * * * * ?", null)
        //需要移除这个调度任务
        jobService.deleteJob("dailyJob", "systemJob")

    }

    override fun execute(context: JobExecutionContext) {
        StaticLog.info("=========Daily job executed at {}", context.fireTime)
//        getUserService().initTypicalUsers()
    }

    private fun getUserService(): UserService {
        if (userService == null) {
            userService = SpringUtil.getBean(UserService::class.java)
        }
        return userService!!
    }
}
