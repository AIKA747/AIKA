package com.parsec.aika.user.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.lang.Validator
import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.em.UserResultCode
import com.parsec.aika.user.config.RabbitmqConst.EMAIL_SEND_RECORD_EXCHANGE
import com.parsec.aika.user.config.RabbitmqConst.EMAIL_SEND_RECORD_ROUTE_KEY
import com.parsec.aika.user.model.em.RedisKeyPrefix
import com.parsec.aika.user.service.EmailService
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit
import javax.annotation.Resource

@Service
class EmailServiceImpl : EmailService {

    @Resource
    private lateinit var javaMailSender: JavaMailSender

    @Resource
    private lateinit var templateEngine: TemplateEngine

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Value("\${spring.profiles.active}")
    private var env: String? = null

    override fun sendMail(emails: String, title: String, variables: Map<String, Any?>, templateName: String) {
        val emailList = emails.split(",").filter {
            it.isNotBlank()
        }
        emailList.forEach {
            Assert.state(Validator.isEmail(it), "Email [$it] address error")
        }
        if (env == "testci") {
            StaticLog.info("测试发送邮件，直接跳过,To:{}", emails)
            return
        }
        val jsonObject = JSONObject()
        jsonObject.set("email", emails)
        jsonObject.set("subject", title)
        try {
            val redisKey = "${RedisKeyPrefix.limitSendEmail}$emails"
            if (stringRedisTemplate.hasKey(redisKey)) {
                throw BusinessException(UserResultCode.EMAIL_LIMIT)
            }
            StaticLog.info("开始发送邮件服务,To:{}", emails)
            val message = javaMailSender.createMimeMessage()

            val helper = MimeMessageHelper(message, true)
            helper.setFrom("aika@aikavision.com")
            helper.setTo(emailList.toTypedArray())
            helper.setSubject(title)

            val context = Context()
            context.setVariable("title", title)
            context.setVariables(variables)
            val content = templateEngine.process(templateName, context)
            helper.setText(content, true)
            jsonObject.set("content", variables)
            jsonObject.set("sendTime", LocalDateTime.now())
            javaMailSender.send(message)
            //标记1分钟
            stringRedisTemplate.opsForValue().set(redisKey, LocalDateTime.now().toString(), 1, TimeUnit.MINUTES)
            // 发送成功后需要发送邮件日志消息到rabbitmq队列中，保存邮件日志
            jsonObject.set("status", "success")
            rabbitTemplate.convertAndSend(
                EMAIL_SEND_RECORD_EXCHANGE, EMAIL_SEND_RECORD_ROUTE_KEY, jsonObject.toString()
            )
            StaticLog.info("邮件发送结束")
        } catch (e: Exception) {
            jsonObject.set("status", "fail")
            jsonObject.set("errorMsg", e.message)
            rabbitTemplate.convertAndSend(
                EMAIL_SEND_RECORD_EXCHANGE, EMAIL_SEND_RECORD_ROUTE_KEY, jsonObject.toString()
            )
            StaticLog.info("邮件发送异常")
            //本地不抛异常
            if (env != "local") {
                throw e
            }
            e.printStackTrace()
        }
    }
}