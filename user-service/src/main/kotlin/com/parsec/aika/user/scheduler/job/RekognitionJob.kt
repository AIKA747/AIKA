package com.parsec.aika.user.scheduler.job

import cn.hutool.extra.spring.SpringUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.user.model.em.JobType
import com.parsec.aika.user.service.FileUploadService
import com.parsec.aika.user.service.JobService
import com.parsec.aika.user.service.RekognitionService
import org.quartz.Job
import org.quartz.JobExecutionContext
import org.springframework.stereotype.Component
import javax.annotation.PostConstruct
import javax.annotation.Resource

@Component
class RekognitionJob : Job {

    @Resource
    private lateinit var jobService: JobService

    private var rekognitionService: RekognitionService? = null
    private var fileUploadService: FileUploadService? = null

    @PostConstruct
    fun initJob() {
//        jobService.addJob(JobType.rekognitionJob, "rekognitionJob", "systemJob", "* 1/5 * * * ?", null)
        jobService.deleteJob("rekognitionJob", "systemJob")
    }

    override fun execute(context: JobExecutionContext) {
        StaticLog.info("=========rekognition job executed at {}", context.fireTime)
        val jobs = getRekognitionService().processJobs()
        jobs.forEach {
            getFileUploadService().analysisVideoJob(it.jobId!!, it.bucket!!, it.key!!)
        }
    }

    private fun getRekognitionService(): RekognitionService {
        if (rekognitionService == null) {
            rekognitionService = SpringUtil.getBean(RekognitionService::class.java)
        }
        return rekognitionService!!
    }

    private fun getFileUploadService(): FileUploadService {
        if (fileUploadService == null) {
            fileUploadService = SpringUtil.getBean(FileUploadService::class.java)
        }
        return fileUploadService!!
    }
}
