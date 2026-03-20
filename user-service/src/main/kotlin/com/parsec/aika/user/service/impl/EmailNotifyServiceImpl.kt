package com.parsec.aika.user.service.impl

import com.parsec.aika.common.model.constant.RedisCont.FEEDBACK_EMAILS
import com.parsec.aika.common.model.constant.RedisCont.REPORT_EMAILS
import com.parsec.aika.user.service.EmailNotifyService
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class EmailNotifyServiceImpl : EmailNotifyService {

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    override fun getFeedbackEmailNotifyList(): List<String>? {
        return stringRedisTemplate.opsForList().range(FEEDBACK_EMAILS, 0, 100)
    }

    override fun setFeedbackEmailNotify(emails: List<String>) {
        stringRedisTemplate.opsForList().leftPushAll(FEEDBACK_EMAILS, emails)
    }

    override fun getReportEmailNotifyList(): List<String>? {
        return stringRedisTemplate.opsForList().range(REPORT_EMAILS, 0, 100)
    }

    override fun setReportEmailNotify(emails: List<String>) {
        stringRedisTemplate.opsForList().leftPushAll(REPORT_EMAILS, emails)
    }
}