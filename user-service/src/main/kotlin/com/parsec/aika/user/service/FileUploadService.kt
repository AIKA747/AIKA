package com.parsec.aika.user.service

import cn.hutool.json.JSONObject
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.springframework.web.multipart.MultipartFile
import java.io.File

interface FileUploadService {

    /**
     * 上传文件
     */
    fun uploadFile(file: MultipartFile, prefix: String? = null): String

    /**
     * 上传文件
     */
    fun uploadFile(file: File, prefix: String, userInfo: LoginUserInfo?, ip: String?, temp: Boolean): String

    /**
     * 获取视频转换结果
     */
    fun getVideoConvertUrl(videoUrl: String): JSONObject

    /**
     * 创建转换视频任务
     */
    fun createMediaConvertJob(videoUrl: String?)

    /**
     * 清理临时文件
     */
    fun clearTempFiles(): Int

    /**
     * 清理指定日期的临时文件
     */
    fun clearTempFiles(date: String): Int

    /**
     * 查询分析视频任务
     */
    fun analysisVideoJob(jobId: String, objectName: String, bucket: String)
}