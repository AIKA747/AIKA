package com.parsec.aika.user.consumer

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.FeedbackEmailNotifyBO
import com.parsec.aika.user.config.EmailNotifyMqConst.EMAIL_NOTIFY_FEEDBACK_QUEUE
import com.parsec.aika.user.service.EmailNotifyService
import com.parsec.aika.user.service.EmailService
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.time.temporal.ChronoUnit
import javax.annotation.Resource

@Component
class FeedbackEmailNotifyConsumer {

    @Resource
    private lateinit var emailService: EmailService

    @Resource
    private lateinit var emailNotifyService: EmailNotifyService

    @Value("\${notify.mail.feedback:https://admin-test.aikavision.com/supportManagement/feedbacklist/detail/}")
    var url: String? = null

    @RabbitListener(queues = [EMAIL_NOTIFY_FEEDBACK_QUEUE])
    fun feedbackEmailNotify(msg: String) {
        StaticLog.info("feedbackEmailNotify: $msg")
        try {
            val feedbackEmailNotifyList = emailNotifyService.getFeedbackEmailNotifyList()
            if (CollUtil.isEmpty(feedbackEmailNotifyList)) {
                StaticLog.warn("feedbackEmailNotify: feedbackEmailNotifyList is empty")
                return
            }
            val feedbackNotify = JSONUtil.toBean(msg, FeedbackEmailNotifyBO::class.java)
            val data = HashMap<String, Any?>()
            data["feedbackType"] = feedbackNotify.feedbackType
            data["issueId"] = feedbackNotify.issueId
            data["username"] = feedbackNotify.username
            data["feedbackTime"] =
                LocalDateTimeUtil.formatNormal(feedbackNotify.feedbackTime!!.plus(5, ChronoUnit.HOURS))
            data["url"] = "$url${feedbackNotify.feedbackId}"
            emailService.sendMail(
                feedbackEmailNotifyList!!.joinToString(","), "There is a new feedback", data, "userFeedback"
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}