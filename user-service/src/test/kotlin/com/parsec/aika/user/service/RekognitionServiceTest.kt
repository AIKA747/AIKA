package com.parsec.aika.user.service

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import javax.annotation.Resource

@SpringBootTest
class RekognitionServiceTest {

    @Resource
    private lateinit var rekognitionService: RekognitionService


//    @Test
    fun test() {
        val analysisVideoJob = rekognitionService.analysisVideoJob("7bc8235f6f66f4b5148525665fcf8ff751864494e9e92fa4d8626e7904ae9cdc")
        StaticLog.info("analysisVideoJob:{}", JSONUtil.toJsonStr(analysisVideoJob))
    }


}