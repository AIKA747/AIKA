package com.parsec.aika.user.service

/**
 * @author husu
 * @version 1.0
 * @date 2023/12/24.
 */
interface EmailService {
//    fun sendEmail(email: String, subject: String, content: String)

    fun sendMail(emails: String, title: String, variables: Map<String, Any?>, templateName: String)
}
