package com.parsec.aika.user.scheduler.job

import cn.hutool.extra.spring.SpringUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.user.model.em.JobType
import com.parsec.aika.user.service.FileUploadService
import com.parsec.aika.user.service.JobService
import org.quartz.Job
import org.quartz.JobExecutionContext
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct
import javax.annotation.Resource

@Component
class FileClearJob : Job {

    @Resource
    private lateinit var jobService: JobService

    private var fileUploadService: FileUploadService? = null

    @PostConstruct
    fun initJob() {
        //为方便测试，这里设置3秒执行一次，调试好后合并master时需修改为真实执行频率，每天凌晨1点执行 cron："0 0 1 * * ?"
        //不用执行这个方法，舍弃了这个逻辑
//        jobService.addJob(JobType.dailyJob, "dailyJob", "systemJob", "1/3 * * * * ?", null)
        jobService.addJob(JobType.fileClearJob, "fileClearJob", "systemJob", "0 0 1 * * ? ", null)
        //需要移除这个调度任务
//        jobService.deleteJob("fileUploadService", "systemJob")

    }

    override fun execute(context: JobExecutionContext) {
        StaticLog.info("=========File clear job executed at {}", context.fireTime)
        getFileUploadService().clearTempFiles()
    }

    private fun getFileUploadService(): FileUploadService {
        if (fileUploadService == null) {
            fileUploadService = SpringUtil.getBean(FileUploadService::class.java)
        }
        return fileUploadService!!
    }
}
