package com.parsec.aika.user.service.impl

import cn.hutool.core.date.DatePattern
import cn.hutool.core.date.DateUtil
import cn.hutool.core.io.FileUtil
import cn.hutool.core.io.file.FileNameUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.IdUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.SensitiveFile
import com.parsec.aika.user.service.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.mediaconvert.model.JobStatus
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import software.amazon.awssdk.services.s3.model.S3Object
import java.io.File
import java.util.*
import java.util.concurrent.TimeUnit
import javax.annotation.PostConstruct
import javax.annotation.Resource

@RefreshScope
@Service
class FileUploadServiceImpl : FileUploadService {

    @Resource
    private lateinit var mediaconvertService: MediaconvertService

    @Resource
    private lateinit var rekognitionService: RekognitionService

    @Autowired
    private lateinit var sensitiveFileService: SensitiveFileService

    @Autowired
    private lateinit var videoThumbnailService: VideoThumbnailService

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Value("\${aws.accessKey}")
    private val accessKey: String? = null

    @Value("\${aws.secretKey}")
    private val secretKey: String? = null

    @Value("\${aws.region:us-east-1}")
    private val region: String? = null

    @Value("\${aws.s3.bucketName:usaikafiles}")
    private val bucketName: String? = null

    @Value("\${aws.s3.cndDomain:https://d1mkcxdxp63f5c.cloudfront.net}")
    private val cndDomain: String? = null

    @Value("\${aws.s3.imageBucketName:imgtransformationstack-s3sampleoriginalimagebucket-wtbl33zrg04q}")
    private val imageBucketName: String? = null

    @Value("\${aws.s3.imageCndDomain:https://d3la0n0y456baq.cloudfront.net}")
    private val imageCndDomain: String? = null

    @Value("\${aws.s3.prefix:files}")
    private val pathPrefix: String? = null

    @Value("\${aws.s3.tempExpDays:15}")
    private val tempExpDays: Int = 15

    private lateinit var s3Client: S3Client

    private final var videoJobKey = "video:job:"
    private final var videoCovertKey = "video:covert:"
    private final var videoRekognitionKey = "video:rekognition:"

    @PostConstruct
    fun init() {
        s3Client = S3Client.builder().region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
            .build()
        StaticLog.info("S3Client init success!!")
    }

    override fun uploadFile(file: MultipartFile, prefix: String?): String {
        val filePathPrefix = prefix ?: pathPrefix
        val key = "$filePathPrefix/${
            DateUtil.date().toString(DatePattern.PURE_DATE_FORMAT)
        }/${IdUtil.nanoId()}.${FileUtil.getSuffix(file.originalFilename)}"
        val bucket = if (prefix == "images") {
            imageBucketName
        } else {
            bucketName
        }
        s3Client.putObject(
            PutObjectRequest.builder().bucket(bucket).key(key).contentType(FileUtil.getMimeType(key)).build(),
            RequestBody.fromInputStream(file.inputStream, file.size)
        )
        return generateS3Url(key)
    }

    override fun uploadFile(file: File, prefix: String, userInfo: LoginUserInfo?, ip: String?, temp: Boolean): String {
        val date = DateUtil.date().toString(DatePattern.PURE_DATE_FORMAT)
        val suffix = FileUtil.getSuffix(file.name)
        val fileId = IdUtil.nanoId()
        val key = if (temp) {
            "$prefix/temp/$date/$fileId.$suffix"
        } else {
            "$prefix/$date/$fileId.$suffix"
        }
        val bucket = if (prefix == "images") {
            imageBucketName
        } else {
            bucketName
        }
        putObject(bucket!!, key, file)
        val generateS3Url = generateS3Url(key)
        if (prefix == "images") {
            val pair = rekognitionService.analysisImage(bucket, key)
            if (pair.first > 0.0) {
                //记录违规文件信息
                sensitiveFileService.save(SensitiveFile().apply {
                    this.fileUrl = generateS3Url
                    this.score = pair.first
                    this.creator = userInfo?.userId
                    this.ip = ip
                    this.labels = pair.second
                })
                return ""
            }
        } else if (prefix == "videos") {
            val jobId = rekognitionService.analysisVideo(bucket, key)
            StaticLog.info("rekognition  jobId: $jobId")
            //缓存一下视频审核任务
            val opsForHash = stringRedisTemplate.opsForHash<String, Any?>()
            opsForHash.put("$videoRekognitionKey$jobId", "url", generateS3Url)
            opsForHash.put("$videoRekognitionKey$jobId", "ip", ip ?: "-")
            opsForHash.put("$videoRekognitionKey$jobId", "userId", userInfo?.userId ?: 0)
            stringRedisTemplate.expire("$videoRekognitionKey$jobId", tempExpDays.toLong(), TimeUnit.DAYS)
            //生成缩略图
//            generateThumbnail(file, bucket, key.replace(".$suffix", ".jpg"))
        }
        return generateS3Url
    }

    /**
     * 生成视频缩略图
     */
//    private fun generateThumbnail(file: File, bucket: String, key: String) {
//        try {
//            val thumbnail = videoThumbnailService.generateThumbnail(file, 1)
//            putObject(bucket, key, thumbnail)
//        } finally {
//            file.delete()
//        }
//    }

    private fun putObject(bucket: String, key: String, file: File) {
        s3Client.putObject(
            PutObjectRequest.builder().bucket(bucket).key(key).contentType(FileUtil.getMimeType(key)).build(),
            RequestBody.fromInputStream(file.inputStream(), file.length())
        )
    }

    override fun getVideoConvertUrl(videoUrl: String): JSONObject {
        var convertUrl = stringRedisTemplate.opsForValue().get("$videoCovertKey$videoUrl")
        if (StrUtil.isNotBlank(convertUrl)) {
            return JSONObject().apply {
                set("status", "COMPLETE")
                set("videoUrl", convertUrl)
                set("thumbnailUrl", convertUrl!!.replace(".mp4", ".0000000.jpg"))
            }
        }
        //查询视频链接绑定的jobId
        val jobId = stringRedisTemplate.opsForValue().get("$videoJobKey$videoUrl")
        if (StrUtil.isBlank(jobId)) {
            return JSONObject().apply {
                set("status", "NONE")
            }
        }
        for (i in 0..5) {
            val status = mediaconvertService.getJobStatus(jobId)
            if (status == JobStatus.COMPLETE) {
                val path = getS3PathFormUrl(videoUrl)
                val fileExtension = FileNameUtil.extName(path)
                convertUrl = generateS3Url("out${path.replace(".$fileExtension", "_$fileExtension")}.mp4")
                stringRedisTemplate.opsForValue().set("$videoCovertKey$videoUrl", convertUrl, 30, TimeUnit.DAYS)
                return JSONObject().apply {
                    this.set("status", status.name)
                    this.set("videoUrl", convertUrl)
                    this.set("thumbnailUrl", convertUrl.replace(".mp4", ".0000000.jpg"))
                }
            }
            if (status == JobStatus.CANCELED || status == JobStatus.ERROR || status == JobStatus.UNKNOWN_TO_SDK_VERSION) {
                return JSONObject().apply {
                    this.set("status", status.name)
                }
            }
            ThreadUtil.sleep(1000)
        }
        return JSONObject().apply {
            set("status", "NONE")
        }
    }

    override fun createMediaConvertJob(videoUrl: String?) {
        try {
            val path = this.getS3PathFormUrl(videoUrl)
            val fileExtension = FileNameUtil.extName(path)
            val sourcePath = "s3://$bucketName$path"
            val targetPath = "s3://$bucketName/out${path.replace(".$fileExtension", "_$fileExtension")}"
            StaticLog.info("sourcePath: $sourcePath, targetPath: $targetPath")
            //进行视频压缩
            val jobId = mediaconvertService.createJob(sourcePath, targetPath)
            StaticLog.info("sourcePath: $sourcePath, targetPath: $targetPath,  jobId: $jobId")
            //保存jobId
            stringRedisTemplate.opsForValue().set("$videoJobKey$videoUrl", jobId, 30, TimeUnit.DAYS)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun clearTempFiles(): Int {
        val clearDate = DateUtil.offsetDay(Date(), -tempExpDays).toString(DatePattern.PURE_DATE_FORMAT)
        return clearTempFiles(clearDate)
    }

    override fun clearTempFiles(date: String): Int {
        StaticLog.info("=====================================> clear temp files start <=====================================")
        var count = 0
        try {
            // 列出temp目录下的图片文件
            val response = s3Client.listObjectsV2(
                ListObjectsV2Request.builder().bucket(imageBucketName).prefix("images/temp/$date/").build()
            )
            response.contents().map(S3Object::key).forEach {
                deleteFile(it, imageBucketName)
            }
            count += response.contents().size
            //临时文件集合
            val clearFiles = ArrayList<S3Object>()
            //视频文件
            val response1 = s3Client.listObjectsV2(
                ListObjectsV2Request.builder().bucket(bucketName).prefix("videos/temp/$date/").build()
            )
            clearFiles.addAll(response1.contents())
            //删除压缩视频临时文件
            val response2 = s3Client.listObjectsV2(
                ListObjectsV2Request.builder().bucket(bucketName).prefix("out/videos/temp/$date/").build()
            )
            clearFiles.addAll(response2.contents())
            //其他文件
            val response3 = s3Client.listObjectsV2(
                ListObjectsV2Request.builder().bucket(bucketName).prefix("files/temp/$date/").build()
            )
            clearFiles.addAll(response3.contents())
            //删除临时视频文件
            clearFiles.map(S3Object::key).forEach(this::deleteFile)
            count += clearFiles.size
        } catch (e: Exception) {
            StaticLog.error("Failed to clear temp files", e)
        }
        StaticLog.info("Clear temp files completed,clear date: $date,file size:{}", count)
        return count
    }

    override fun analysisVideoJob(jobId: String, objectName: String, bucket: String) {
        val pair = rekognitionService.analysisVideoJob(jobId)
        if (pair.first > 0.0) {
            val videoMap = stringRedisTemplate.opsForHash<String, String?>().entries("$videoRekognitionKey$jobId")
            //记录违规文件信息
            sensitiveFileService.save(SensitiveFile().apply {
                this.fileUrl = (videoMap["url"] ?: "$bucket:$objectName").toString()
                this.score = pair.first
                this.creator = (videoMap["userId"] ?: "0").toString().toLong()
                this.ip = (videoMap["ip"] ?: "-").toString()
                this.labels = pair.second
            })
            //删除敏感的视频文件
            deleteFile(objectName, bucket)
        }
    }


    private fun deleteFile(key: String, bucket: String? = bucketName) {
        val objectResponse = s3Client.deleteObject(
            DeleteObjectRequest.builder().bucket(bucket).key(key).build()
        )
        StaticLog.info("delete file: $key, statusCode: ${objectResponse.sdkHttpResponse().statusCode()}")
    }

    private fun getS3PathFormUrl(videoUrl: String?): String {
        Assert.state(StrUtil.startWith(videoUrl, cndDomain), "Video link error")
        return StrUtil.removePrefix(videoUrl, cndDomain)
    }

    private fun generateS3Url(key: String): String {
//        return "https://${bucketName}.s3.amazonaws.com/$key"
        val domain = if (key.startsWith("images")) {
            imageCndDomain
        } else {
            cndDomain
        }
        return "$domain/$key"
    }
}