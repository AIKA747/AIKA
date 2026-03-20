package com.parsec.aika.admin.consumer

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.admin.service.EmailLogService
import com.parsec.aika.admin.config.RabbitmqConst.EMAIL_SEND_RECORD_QUEUE
import com.parsec.aika.common.model.bo.EmailLogBO
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import javax.annotation.Resource


@Component
class EmailLogConsumer {

    @Resource
    private lateinit var emailLogService: EmailLogService

    @RabbitHandler
    @RabbitListener(queues = [EMAIL_SEND_RECORD_QUEUE])
    fun emailLogReceiver(msg: String) {
        try {
            StaticLog.info("${EMAIL_SEND_RECORD_QUEUE},收到发送邮件内容：{}", msg)
            val emailLogBO = JSONUtil.toBean(msg, EmailLogBO::class.java)
            StaticLog.info("emailLogBO:{}", JSONUtil.toJsonStr(emailLogBO))
            emailLogService.emailLogSave(emailLogBO)
        } catch (e: Exception) {
            StaticLog.error("处理邮件发送日志异常")
            e.printStackTrace()
        }
    }


}