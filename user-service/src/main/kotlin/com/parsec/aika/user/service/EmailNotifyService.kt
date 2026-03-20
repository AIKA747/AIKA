package com.parsec.aika.user.service

interface EmailNotifyService {
    fun getFeedbackEmailNotifyList(): List<String>?
    fun setFeedbackEmailNotify(emails: List<String>)
    fun getReportEmailNotifyList(): List<String>?
    fun setReportEmailNotify(emails: List<String>)
}