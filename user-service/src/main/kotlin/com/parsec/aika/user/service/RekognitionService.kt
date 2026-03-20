package com.parsec.aika.user.service

import com.parsec.aika.user.model.entity.VideoRekognitionJob

interface RekognitionService {
    /**
     * 分析图片
     */
    fun analysisImage(bucket: String, key: String): Pair<Double, String>

    /**
     * 分析视频
     */
    fun analysisVideo(bucket: String, key: String): String

    /**
     * 获取视频审核结果
     */
    fun analysisVideoJob(jobId: String): Pair<Double, String>

    /**
     * 查询为结束的jobs
     */
    fun processJobs(): List<VideoRekognitionJob>

}