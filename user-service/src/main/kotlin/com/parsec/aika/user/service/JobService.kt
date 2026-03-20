package com.parsec.aika.user.service

import cn.hutool.json.JSONObject
import com.parsec.aika.user.model.em.JobType


/**
 * @program: quartz
 * @description: service
 */
interface JobService {
    /**
     * 添加一个定时任务
     * @param jobId
     * @param jobGroup
     * @param cron
     */
    fun addJob(jobType: JobType, jobId: String?, jobGroup: String?, cron: String?, data: JSONObject?)

    /**
     * 暂停任务
     * @param jobId
     * @param jobGroup
     */
    fun pauseJob(jobId: String?, jobGroup: String?)

    /**
     * 恢复任务
     * @param jobId
     * @param jobGroup
     */
    fun resumeJob(jobId: String?, jobGroup: String?)

    /**
     * 删除job
     * @param jobId
     * @param jobGroup
     */
    fun deleteJob(jobId: String?, jobGroup: String?)
}