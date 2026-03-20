package com.parsec.aika.user.consumer

import cn.hutool.core.collection.CollUtil
import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.ReportEmailNotifyBO
import com.parsec.aika.user.config.EmailNotifyMqConst.EMAIL_NOTIFY_REPORT_QUEUE
import com.parsec.aika.user.service.EmailNotifyService
import com.parsec.aika.user.service.EmailService
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.time.temporal.ChronoUnit
import javax.annotation.Resource

@Component
class ReportEmailNotifyConsumer {

    @Resource
    private lateinit var emailService: EmailService

    @Resource
    private lateinit var emailNotifyService: EmailNotifyService

    @Value("\${notify.mail.report:https://admin-test.aikavision.com/contentManagement/reportList/}")
    var url: String? = null

    @RabbitListener(queues = [EMAIL_NOTIFY_REPORT_QUEUE])
    fun reportEmailNotify(msg: String) {
        StaticLog.info("reportEmailNotify: $msg")
        try {
            val reportEmailNotifyList = emailNotifyService.getReportEmailNotifyList()
            if (CollUtil.isEmpty(reportEmailNotifyList)) {
                StaticLog.warn("reportEmailNotify: reportEmailNotifyList is empty")
                return
            }
            val reportNotify = JSONUtil.toBean(msg, ReportEmailNotifyBO::class.java)
            val data = HashMap<String, Any?>()
            data["reportType"] = reportNotify.reportType
            data["authorName"] = reportNotify.authorName
            data["reportTime"] = LocalDateTimeUtil.formatNormal(reportNotify.reportTime!!.plus(5, ChronoUnit.HOURS))
            data["url"] = "$url${reportNotify.reportId}"
            emailService.sendMail(
                reportEmailNotifyList!!.joinToString(","), "There is a new report on an Agora post", data, "userReport"
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}