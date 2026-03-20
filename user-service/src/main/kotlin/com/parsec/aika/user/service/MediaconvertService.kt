package com.parsec.aika.user.service

import software.amazon.awssdk.services.mediaconvert.model.JobStatus

/**
 * 视频压缩服务
 */
interface MediaconvertService {

    fun createJob(source: String, target: String): String

    fun getJobStatus(jobId: String?): JobStatus
}