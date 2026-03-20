package com.parsec.aika.user.service.impl

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.user.mapper.VideoRekognitionJobMapper
import com.parsec.aika.user.model.entity.VideoRekognitionJob
import com.parsec.aika.user.service.RekognitionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Service
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.rekognition.RekognitionClient
import software.amazon.awssdk.services.rekognition.model.*
import java.time.LocalDateTime
import javax.annotation.PostConstruct

@RefreshScope
@Service
class RekognitionServiceImpl : RekognitionService {

    @Autowired
    private lateinit var videoRekognitionJobMapper: VideoRekognitionJobMapper

    @Value("\${aws.accessKey}")
    private val accessKey: String? = null

    @Value("\${aws.secretKey}")
    private val secretKey: String? = null

    @Value("\${aws.region:us-east-1}")
    private val region: String? = null

    @Value("\${aws.rekognition.topic:arn:aws:sns:us-east-1:533267032061:aika-test-video-rekognition}")
    private val topic: String? = null

    private val roleArn = "arn:aws:iam::533267032061:role/sns"

    private lateinit var rekognitionClient: RekognitionClient

    @PostConstruct
    fun init() {
        rekognitionClient = RekognitionClient.builder().region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
            .build()
        StaticLog.info("RekognitionClient init success!!")
    }

    override fun analysisImage(bucket: String, key: String): Pair<Double, String> {
        val response = rekognitionClient.detectModerationLabels(
            DetectModerationLabelsRequest.builder().image(
                Image.builder().s3Object(
                    S3Object.builder().bucket(bucket).name(key).build()
                ).build()
            ).minConfidence(60.0f).build()
        )
        val moderationLabels = response.moderationLabels()
        StaticLog.info("moderationLabels.size: ${moderationLabels.size}")
        if (CollUtil.isNotEmpty(moderationLabels)) {
            return Pair(
                moderationLabels.maxOf { it.confidence() }.toDouble(), JSONUtil.toJsonStr(moderationLabels.map {
                    mapOf(
                        "name" to it.name(), "confidence" to it.confidence(), "parentName" to it.parentName()
                    )
                })
            )
        }
        return Pair(0.0, "")
    }

    override fun analysisVideo(bucket: String, key: String): String {
        val response = rekognitionClient.startContentModeration(
            StartContentModerationRequest.builder().video(
                Video.builder().s3Object(
                    S3Object.builder().bucket(bucket).name(key).build()
                ).build()
            ).notificationChannel(
                NotificationChannel.builder().snsTopicArn(topic).roleArn(roleArn).build()
            ).build()
        )
        Assert.state(response.sdkHttpResponse().isSuccessful, response.sdkHttpResponse().statusText().get())
        val jobId = response.jobId()
        videoRekognitionJobMapper.insert(VideoRekognitionJob().apply {
            this.jobId = jobId
            this.status = VideoJobStatus.IN_PROGRESS
            this.bucket = bucket
            this.key = key
        })
        return jobId
    }

    override fun analysisVideoJob(jobId: String): Pair<Double, String> {
        val response = rekognitionClient.getContentModeration(
            GetContentModerationRequest.builder().jobId(jobId).build()
        )
        var score = 0.0
        var labels = ""
        val jobStatus = response.jobStatus()
        if (jobStatus == VideoJobStatus.SUCCEEDED) {
            val moderationLabels = response.moderationLabels()
            if (CollUtil.isNotEmpty(moderationLabels)) {
                score = moderationLabels.maxOf { it.moderationLabel().confidence() }.toDouble()
                labels = JSONUtil.toJsonStr(moderationLabels.map { it.moderationLabel() }.map {
                    mapOf("name" to it.name(), "confidence" to it.confidence(), "parentName" to it.parentName())
                })
            }
        }
        videoRekognitionJobMapper.updateById(VideoRekognitionJob().apply {
            this.jobId = jobId
            this.status = jobStatus
            this.endAt = LocalDateTime.now()
        })
        return Pair(score, labels)
    }

    override fun processJobs(): List<VideoRekognitionJob> {
        return videoRekognitionJobMapper.selectList(
            KtQueryWrapper(VideoRekognitionJob::class.java).eq(VideoRekognitionJob::status, VideoJobStatus.IN_PROGRESS)
        )
    }
}