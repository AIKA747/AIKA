package com.parsec.aika.bot.service

import cn.hutool.log.StaticLog
import com.parsec.aika.bot.BotServiceApplicationTests
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class SttServiceTest : BotServiceApplicationTests() {

    @Autowired
    lateinit var sttService: SttService

//    @Test
    fun stt() {
        val speechUrl =
            "https://aika-demo.s3.amazonaws.com/public/fc8ea1b65d4d45fda4ed2c8683e08d3a_recording-969cbad0-fcbd-4ae3-8f9d-d42455d07c72.m4a"
        val stt = sttService.stt(speechUrl)
        StaticLog.info("解析出的文本：{}", stt)
    }

}