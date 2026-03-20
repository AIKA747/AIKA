package com.parsec.aika.user.controller

import cn.hutool.core.io.FileUtil
import cn.hutool.core.io.file.FileNameUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.SensitiveFile
import com.parsec.aika.user.service.FileUploadService
import com.parsec.aika.user.service.NsfwService
import com.parsec.aika.user.service.SensitiveFileService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.exception.core.BusinessException
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.util.concurrent.CompletableFuture
import java.util.concurrent.Executors

@RefreshScope
@RestController
class FileUploadController {

    @Autowired
    private lateinit var fileUploadService: FileUploadService

    @Autowired
    private lateinit var nsfwService: NsfwService

    @Autowired
    private lateinit var sensitiveFileService: SensitiveFileService

    @Value("\${nsfw.score:0.8}")
    private var score: Double = 0.8

    // 创建线程池
    private val executorService = Executors.newFixedThreadPool(10)

    //限制仅允许图片类型文件上传
    private final val allowedImageExtensions =
        setOf("jpg", "jpeg", "png", "gif", "tiff", "tif", "bmp", "webp", "svg", "ico", "heic")

    //视频类型文件
    private val allowedVideoExtensions =
        setOf("mp4", "mov", "m4a", "avi", "mkv", "wmv", "webm", "flv", "mxf", "3gp", "m4v", "ogv")

    //限制其他类型文件上传
    val allowedExtensions = setOf("pdf", "doc", "docx", "txt", "log") + allowedImageExtensions + allowedVideoExtensions

    @PostMapping("/public/file-upload")
    fun uploadFile(
        file: MultipartFile, temp: Boolean = false, userInfo: LoginUserInfo?, request: HttpServletRequest
    ): BaseResult<*> {
        //文件不能为空
        if (file.isEmpty) {
            return BaseResult.failure("file is empty")
        }
        val fileExtension = FileNameUtil.extName(file.originalFilename).lowercase()
        if (fileExtension.isNotEmpty() && !allowedExtensions.contains(fileExtension)) {
            return BaseResult.failure("Unsupported file type")
        }
        val pathPrefix = if (allowedImageExtensions.contains(fileExtension)) {
            "images"
        } else if (allowedVideoExtensions.contains(fileExtension)) {
            "videos"
        } else {
            "files"
        }
        //创建临时文件
        val tempFile = FileUtil.createTempFile(pathPrefix, ".$fileExtension", true)
        try {
            file.transferTo(tempFile)
            //由于内容审核和文件上传都是耗时操作，并行处理
            val uploadFileFuture = CompletableFuture.supplyAsync({
                //上传文件
                fileUploadService.uploadFile(tempFile, pathPrefix, userInfo, getClientIp(request), temp)
            }, executorService)
            if (pathPrefix == "files") {
                val checkFuture = CompletableFuture.supplyAsync({
                    // 文件内容审核（可以并行处理）
                    nsfwService.contentCheck(tempFile)
                }, executorService)
                //文件内容审核
                val fileScore = checkFuture.get()
                if (fileScore >= score) {
                    executorService.execute {
                        //记录违规文件信息
                        sensitiveFileService.save(SensitiveFile().apply {
                            this.fileUrl = uploadFileFuture.get()
                            this.score = fileScore
                            this.creator = userInfo?.userId
                            this.ip = getClientIp(request)
                        })
                    }
                    throw BusinessException("file contains sensitive content")
                }
            }
            // 等待上传文件完成
            val uploadFile = uploadFileFuture.get()
            if (StrUtil.isBlank(uploadFile)) {
                throw BusinessException("file contains sensitive content")
            }
            if (pathPrefix == "videos") {
                fileUploadService.createMediaConvertJob(uploadFile)
            }
            return BaseResult.success(uploadFile)
        } finally {
            tempFile.delete()
        }
    }

    /**
     * 查询视频转换结果
     */
    @GetMapping("/public/video/convert-result")
    fun getVideoConvertUrl(videoUrl: String): BaseResult<*> {
        return BaseResult.success(fileUploadService.getVideoConvertUrl(videoUrl))
    }

    /**
     *获取客户端ip地址
     */
    fun getClientIp(request: HttpServletRequest): String {
        var ip = request.getHeader("X-Forwarded-For")
        if (ip.isNullOrBlank() || "unknown".equals(ip, ignoreCase = true)) {
            ip = request.getHeader("X-Real-IP")
        }
        if (ip.isNullOrBlank() || "unknown".equals(ip, ignoreCase = true)) {
            ip = request.remoteHost
        }
        // 如果存在多个代理，取第一个 IP 作为客户端真实 IP
        if (!ip.isNullOrBlank() && ip.contains(",")) {
            ip = ip.split(",")[0].trim()
        }
        return ip ?: "unknown"
    }

    @DeleteMapping("/manage/temp-files")
    fun clearTempFiles(date: String): BaseResult<*> {
        Assert.state(isValidDateFormat(date), "date is error")
        return BaseResult.success(fileUploadService.clearTempFiles(date))
    }

    fun isValidDateFormat(dateString: String): Boolean {
        return try {
            LocalDate.parse(dateString, DateTimeFormatter.ofPattern("yyyyMMdd"))
            true
        } catch (e: DateTimeParseException) {
            false
        }
    }

}