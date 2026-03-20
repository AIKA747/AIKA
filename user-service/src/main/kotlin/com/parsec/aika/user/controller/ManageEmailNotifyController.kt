package com.parsec.aika.user.controller

import cn.hutool.core.lang.Assert
import cn.hutool.core.lang.Validator
import com.parsec.aika.user.service.EmailNotifyService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageEmailNotifyController {

    @Resource
    private lateinit var emailNotifyService: EmailNotifyService

    @GetMapping("/manage/feedback/notify/email")
    fun getFeedbackEmailNotifyList(): BaseResult<*> {
        return BaseResult.success(emailNotifyService.getFeedbackEmailNotifyList())
    }

    @PutMapping("/manage/feedback/notify/email")
    fun setFeedbackEmailNotify(@RequestBody emails: List<String>): BaseResult<*> {
        emails.filter {
            it.isNotBlank()
        }.forEach {
            Assert.state(Validator.isEmail(it), "Email [$it] address error")
        }
        emailNotifyService.setFeedbackEmailNotify(emails)
        return BaseResult.success(emails)
    }

    @GetMapping("/manage/report/notify/email")
    fun getReportEmailNotifyList(): BaseResult<*> {
        return BaseResult.success(emailNotifyService.getReportEmailNotifyList())
    }

    @PutMapping("/manage/report/notify/email")
    fun setReportEmailNotify(@RequestBody emails: List<String>): BaseResult<*> {
        emails.filter {
            it.isNotBlank()
        }.forEach {
            Assert.state(Validator.isEmail(it), "Email [$it] address error")
        }
        emailNotifyService.setReportEmailNotify(emails)
        return BaseResult.success(emails)
    }


}