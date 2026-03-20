package com.parsec.aika.bot.service.impl

import cn.hutool.core.date.DatePattern
import cn.hutool.core.date.DateUtil
import cn.hutool.core.io.FileUtil
import cn.hutool.core.util.IdUtil
import cn.hutool.http.HttpUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.service.FileUploadService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.core.internal.util.Mimetype
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import java.io.File
import javax.annotation.PostConstruct

@Service
class FileUploadServiceImpl : FileUploadService {

    @Value("\${aws.accessKey:}")
    private val accessKey: String? = null

    @Value("\${aws.secretKey:}")
    private val secretKey: String? = null

    @Value("\${aws.region:}")
    private val region: String? = null

    @Value("\${aws.s3.bucketName:}")
    private val bucketName: String? = null

    @Value("\${aws.s3.cndDomain:}")
    private val cndDomain: String? = null

    @Value("\${aws.s3.imageBucketName:}")
    private val imageBucketName: String? = null

    @Value("\${aws.s3.imageCndDomain:}")
    private val imageCndDomain: String? = null

    @Value("\${aws.s3.prefix:}")
    private val pathPrefix: String? = null

    private lateinit var s3Client: S3Client

    @PostConstruct
    fun init() {
        StaticLog.info("S3Client init start...")
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
            PutObjectRequest.builder().bucket(bucket).key(key).build(),
            RequestBody.fromInputStream(file.inputStream, file.size)
        )
        return generateS3Url(key)
    }

    override fun uploadFile(file: File, prefix: String?): String {
        val filePathPrefix = prefix ?: pathPrefix
        val key = "$filePathPrefix/${
            DateUtil.date().toString(DatePattern.PURE_DATE_FORMAT)
        }/${IdUtil.nanoId()}_${file.name}"
        val bucket = if (prefix == "images") {
            imageBucketName
        } else {
            bucketName
        }
        s3Client.putObject(
            PutObjectRequest.builder().bucket(bucket).key(key).build(), RequestBody.fromFile(file)
        )
        return generateS3Url(key)
    }

    override fun uploadFile(audioData: ByteArray, subfix: String, contentType: String?, prefix: String?): String {
        val key = "$prefix/${DateUtil.date().toString(DatePattern.PURE_DATE_PATTERN)}/${IdUtil.nanoId()}.$subfix"
        val bucket = if (prefix == "images") {
            imageBucketName
        } else {
            bucketName
        }
        s3Client.putObject(
            PutObjectRequest.builder().bucket(bucket).key(key)
                .contentType(contentType ?: Mimetype.MIMETYPE_OCTET_STREAM).build(), RequestBody.fromBytes(audioData)
        )
        return generateS3Url(key)
    }

    override fun uploadFile(fileUrl: String, subfix: String, contentType: String?, prefix: String?): String {
        try {
            // 从在线链接获取视频的输入流
            val key = "$prefix/${DateUtil.date().toString(DatePattern.PURE_DATE_PATTERN)}/${IdUtil.nanoId()}.$subfix"
            val bucket = if (prefix == "images") {
                imageBucketName
            } else {
                bucketName
            }
            s3Client.putObject(
                PutObjectRequest.builder().bucket(bucket).key(key)
                    .contentType(contentType ?: Mimetype.MIMETYPE_OCTET_STREAM).build(),
                RequestBody.fromBytes(HttpUtil.downloadBytes(fileUrl))
            )
            return generateS3Url(key)
        } catch (e: Exception) {
            StaticLog.error(e)
            return fileUrl
        }
    }

    private fun generateS3Url(key: String): String {
        val domain = if (key.startsWith("images")) {
            imageCndDomain
        } else {
            cndDomain
        }
        return "$domain/$key"
    }
}