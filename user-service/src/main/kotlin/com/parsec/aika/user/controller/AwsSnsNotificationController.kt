package com.parsec.aika.user.controller

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.user.service.FileUploadService
import io.awspring.cloud.messaging.config.annotation.NotificationMessage
import io.awspring.cloud.messaging.config.annotation.NotificationSubject
import io.awspring.cloud.messaging.endpoint.NotificationStatus
import io.awspring.cloud.messaging.endpoint.annotation.NotificationMessageMapping
import io.awspring.cloud.messaging.endpoint.annotation.NotificationSubscriptionMapping
import io.awspring.cloud.messaging.endpoint.annotation.NotificationUnsubscribeConfirmationMapping
import jakarta.servlet.http.HttpServletRequest
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
@RequestMapping("/public/video/rekognition-result") // 你提供给SNS的URL路径
class AwsSnsNotificationController {

    @Resource
    private lateinit var fileUploadService: FileUploadService

    // 处理订阅确认请求
    @NotificationSubscriptionMapping
    fun handleSubscriptionMessage(notificationStatus: NotificationStatus) {
        StaticLog.info("Received subscription confirmation from SNS. Confirming...");
        // 你必须确认订阅，否则SNS可能不会发送消息
        notificationStatus.confirmSubscription()
    }

    // 处理实际的通知消息
    @NotificationMessageMapping
    fun handleNotificationMessage(
        @NotificationMessage message: String, @NotificationSubject subject: String, request: HttpServletRequest
    ) {
        StaticLog.info("Received SNS message with subject: {}", subject);
        StaticLog.info("Message content: {}", message);
        // 在这里解析和处理消息内容
        // message通常是JSON字符串，包含视频审核结果
        processVideoAnalysisResult(message)
    }

    // 处理退订确认请求
    @NotificationUnsubscribeConfirmationMapping
    fun handleUnsubscribeMessage(notificationStatus: NotificationStatus) {
        StaticLog.info("Received unsubscribe confirmation from SNS.");
        notificationStatus.confirmSubscription() // 即使是退订确认，也需要响应
    }

    private fun processVideoAnalysisResult(messageJson: String) {
        try {
            StaticLog.info("Processing video analysis result: {}", messageJson)
            val obj = JSONUtil.parseObj(messageJson)
            val jobId = obj.getStr("jobId")
            val videoObj = obj.getJSONObject("Video")
            val objectName = videoObj.getStr("S3ObjectName")
            val bucket = videoObj.getStr("S3Bucket")
            fileUploadService.analysisVideoJob(jobId, objectName, bucket)
        } catch (e: Exception) {
            StaticLog.error("Error processing video analysis result", e)
        }
    }

}