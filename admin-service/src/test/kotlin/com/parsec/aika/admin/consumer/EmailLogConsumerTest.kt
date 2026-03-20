package com.parsec.aika.admin.consumer

import cn.hutool.json.JSONObject
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class EmailLogConsumerTest {

    @Resource
    private lateinit var emailLogConsumer: EmailLogConsumer

    @Test
    @Rollback
    @Transactional
    fun emailLogReceiver() {
        val jsonObject = JSONObject()
        jsonObject.putOpt("email", "pc_yuanmr@hotmail.com")
        jsonObject.putOpt("subject", "Verify your email address")
        jsonObject.putOpt("content", "<!DOCTYPE html>\n" +
                "<html lang=\"zh-CN\">\n" +
                "<head>\n" +
                "    <meta charset=\"utf-8\" />\n" +
                "    <title>Verify your email address</title>\n" +
                "</head>\n" +
                "<body>\n" +
                "<noscript> You need to enable JavaScript to run this app. </noscript>\n" +
                "<div id=\"root\">\n" +
                "    <style>\n" +
                "        body,\n" +
                "        html,\n" +
                "        #root {\n" +
                "            height: 100%;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "            color: #ffffff;\n" +
                "            font-size: 14px;\n" +
                "        }\n" +
                "\n" +
                "        .page-resetPassword {\n" +
                "            display: flex;\n" +
                "            flex-direction: row;\n" +
                "            align-items: flex-start;\n" +
                "            justify-content: center;\n" +
                "            width: 100%;\n" +
                "            height: 100%;\n" +
                "            color: #ffffff;\n" +
                "        }\n" +
                "        .resetPassword-body {\n" +
                "            position: relative;\n" +
                "            width: 960px;\n" +
                "            height: 100%;\n" +
                "            background-color: #4c455e;\n" +
                "        }\n" +
                "        .resetPassword-content {\n" +
                "            position: absolute;\n" +
                "            top: 35%;\n" +
                "            left: 50%;\n" +
                "            display: flex;\n" +
                "            flex-direction: column;\n" +
                "            align-items: flex-start;\n" +
                "            justify-content: center;\n" +
                "            box-sizing: border-box;\n" +
                "            width: 100%;\n" +
                "            padding: 0 70px;\n" +
                "            transform: translate(-50%, -50%);\n" +
                "        }\n" +
                "        .resetPassword-avatar {\n" +
                "            width: 80px;\n" +
                "            height: 80px;\n" +
                "            margin-bottom: 70px;\n" +
                "            border-radius: 12px;\n" +
                "        }\n" +
                "        .resetPassword-title {\n" +
                "            width: 100%;\n" +
                "            margin-bottom: 40px;\n" +
                "            color: #ffffff;\n" +
                "            font-weight: bold;\n" +
                "            font-size: 36px;\n" +
                "            text-align: center;\n" +
                "        }\n" +
                "        .resetPassword-text {\n" +
                "            width: 100%;\n" +
                "            margin-bottom: 40px;\n" +
                "            color: #ffffff;\n" +
                "            font-size: 18px;\n" +
                "            line-height: 24px;\n" +
                "            text-align: left;\n" +
                "        }\n" +
                "        .resetPassword-button {\n" +
                "            width: 225px;\n" +
                "            height: 48px;\n" +
                "            margin: 0 auto 40px;\n" +
                "            color: #ffffff;\n" +
                "            font-size: 18px;\n" +
                "            line-height: 48px;\n" +
                "            text-align: center;\n" +
                "            background-color: #1b1d25;\n" +
                "            border: none;\n" +
                "            border-radius: 8px;\n" +
                "            cursor: pointer;\n" +
                "        }\n" +
                "    </style>\n" +
                "    <div class=\"page-resetPassword\">\n" +
                "        <div class=\"resetPassword-body\">\n" +
                "            <div class=\"resetPassword-content\">\n" +
                "                <img  class=\"resetPassword-avatar\" src='https://aika-demo.s3.ap-southeast-2.amazonaws.com/public/email_logo.png' alt=\"\">\n" +
                "                <div class=\"resetPassword-title\"><span>Verify your email address</span></div>\n" +
                "                <div class=\"resetPassword-text\">\n" +
                "                    <span>Thanks for registering for an account on AlKA! Before we get started, we just need to confirm thatthis is you. Click below to verify your email address:</span>\n" +
                "                </div>\n" +
                "                <button class=\"resetPassword-button\"><a href=\"https://baidu.com\">Verify Email</a></button>\n" +
                "                <div class=\"resetPassword-text\">\n" +
                "                    <span>Click the button below to sign up to AlKA. This link will expire in 1 day.</span>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</div>\n" +
                "</body>\n" +
                "</html>\n")
        emailLogConsumer.emailLogReceiver(jsonObject.toString())
    }
}