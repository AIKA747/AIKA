package com.parsec.aika.content.service

import cn.hutool.log.StaticLog
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import jakarta.annotation.Resource

@SpringBootTest
class SttServiceTest {

    @Resource
    private lateinit var sttService: SttService

//    @Test
    fun stt() {
        val stt =
            sttService.stt("https://d2w02n628dlis7.cloudfront.net/public/20250313/418fb667be3b4aa69b8b34bcad4845f8.m4a")
        StaticLog.info("stt:{}", stt)
    }

}