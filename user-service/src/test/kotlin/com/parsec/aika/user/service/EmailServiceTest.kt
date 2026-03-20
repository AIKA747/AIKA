package com.parsec.aika.user.service

import cn.hutool.log.StaticLog
import com.parsec.aika.user.UserServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class EmailServiceTest : UserServiceApplicationTests() {

    @Autowired
    private val emailService: EmailService? = null

    @Test
    fun sendEmail1() {
        //有可能链接google邮箱server链接失败
        try {
            val map = HashMap<String, Any>()
            map["description"] =
                "Thanks for registering for an account on AlKA! Before we get started, we just need to confirm thatthis is you. Click below to verify your email address:"
            map["url"] = "https://www.baidu.com"
            map["buttonText"] = "Verify Email"
            map["remarks"] = "Click the button below to sign up to AlKA. This link will expire in 1 day."
//            emailService!!.sendMail("ahzhong@umay-labs.com", "Verify your email address", map, "verify")
            emailService!!.sendMail("ydh@parsec.com.cn", "Verify your email address", map, "verify")
        } catch (e: Exception) {
            StaticLog.error(e)
        }
    }

    @Test
    fun sendEmail2() {
        emailService!!.sendMail(
            "zhangyr@parsec.com.cn", "We miss you at AIKA \uD83D\uDC99", HashMap<String, Any>(), "inactivePush"
        )
    }

}