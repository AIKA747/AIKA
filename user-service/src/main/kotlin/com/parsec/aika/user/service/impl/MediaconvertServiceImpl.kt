package com.parsec.aika.user.service.impl

import cn.hutool.log.StaticLog
import com.parsec.aika.user.service.MediaconvertService
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Service
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.mediaconvert.MediaConvertClient
import software.amazon.awssdk.services.mediaconvert.model.*
import javax.annotation.PostConstruct


@RefreshScope
@Service
class MediaconvertServiceImpl : MediaconvertService {

    @Value("\${aws.accessKey}")
    private val accessKey: String? = null

    @Value("\${aws.secretKey}")
    private val secretKey: String? = null

    @Value("\${aws.region:us-east-1}")
    private val region: String? = null

    private val roleArn = "arn:aws:iam::533267032061:role/MediaConvertServiceRole"

    private lateinit var mediaConvertClient: MediaConvertClient

    @PostConstruct
    fun init() {
        mediaConvertClient = MediaConvertClient.builder().region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
            .build()
        StaticLog.info("MediaConvertClient init success!!")
    }

    override fun createJob(source: String, target: String): String {
        // 1. 定义输入（指定源文件）
        val input = Input.builder().fileInput(source).audioSelectors(
            mapOf(
                "Audio Selector 1" to AudioSelector.builder().defaultSelection(AudioDefaultSelection.DEFAULT).build()
            )
        ).build()
        // 2. 定义视频编码设置（核心压缩参数在这里设置）
        val h264Settings =
            H264Settings.builder().rateControlMode(H264RateControlMode.QVBR).maxBitrate(500000) // 500 kbps 极低比特率
                .framerateControl(H264FramerateControl.INITIALIZE_FROM_SOURCE).gopSize(120.0) // 大GOP加快编码
                .codecProfile(H264CodecProfile.HIGH) // 简单Profile加快编码
                .entropyEncoding(H264EntropyEncoding.CABAC).qvbrSettings(
                    H264QvbrSettings.builder().qvbrQualityLevel(5)// 低质量（1-10，1最差）
                        .build()
                ).build()
        // 3. 定义视频输出
        val audioDesc = AudioDescription.builder().codecSettings(
            AudioCodecSettings.builder().codec(AudioCodec.AAC).aacSettings(
                AacSettings.builder().bitrate(128000)  // 设置比特率
                    .codingMode(AacCodingMode.CODING_MODE_2_0)  // 设置编码模式
                    .sampleRate(48000)  // 设置采样率
                    .build()
            ).build()
        ).audioSourceName("Audio Selector 1").build()
        //3.1 添加音频编码设置
        val videoDesc = VideoDescription.builder().codecSettings(
            VideoCodecSettings.builder().codec(VideoCodec.H_264).h264Settings(h264Settings).build()
        ).build()
        val output = Output.builder().videoDescription(videoDesc).audioDescriptions(audioDesc)
            .containerSettings(ContainerSettings.builder().container(ContainerType.MP4).build()).build()
        //3.2 使用场景变化检测选择关键帧
        val smartSettings =
            FrameCaptureSettings.builder().framerateNumerator(1).framerateDenominator(60) // 低频捕获，我们只需要一张
                .maxCaptures(1) // 只生成一张
                .quality(90).build()

        // 3.3 配置输出 - 只生成一张高质量缩略图
        val output1 = Output.builder().videoDescription(
            VideoDescription.builder().scalingBehavior(ScalingBehavior.DEFAULT).codecSettings(
                VideoCodecSettings.builder().codec(VideoCodec.FRAME_CAPTURE).frameCaptureSettings(smartSettings).build()
            ).build()
        ).containerSettings(ContainerSettings.builder().container(ContainerType.RAW).build()).build()
        // 4. 定义输出组
        val outputGroup = OutputGroup.builder().name("Videos Group").outputGroupSettings(
            OutputGroupSettings.builder().type(OutputGroupType.FILE_GROUP_SETTINGS).fileGroupSettings(
                FileGroupSettings.builder().destination(target).build()
            ).build()
        ).outputs(output, output1).build()
        // 5. 组装作业设置
        val jobSettings = JobSettings.builder().inputs(input).outputGroups(outputGroup).build()
        // 6. 创建作业请求
        val createJobRequest = CreateJobRequest.builder().role(roleArn) // 替换为你的 Role ARN
            .settings(jobSettings).build()
        // 7. 发送请求
        val jobResponse = mediaConvertClient.createJob(createJobRequest);
        return jobResponse.job().id() // 返回作业ID，用于后续状态跟踪
    }

    override fun getJobStatus(jobId: String?): JobStatus {
        return try {
            val getJobRequest = GetJobRequest.builder().id(jobId).build()
            val jobResponse = mediaConvertClient.getJob(getJobRequest)
            if (jobResponse.job().status() == JobStatus.ERROR) {
                StaticLog.error("Job failed: {}", jobResponse.job().errorMessage())
            }
            jobResponse.job().status()
        } catch (e: MediaConvertException) {
            e.printStackTrace()
            // 或根据实际情况处理
            StaticLog.error("Failed to get job status: {}", e.awsErrorDetails().errorMessage())
            JobStatus.ERROR
        }
    }
}