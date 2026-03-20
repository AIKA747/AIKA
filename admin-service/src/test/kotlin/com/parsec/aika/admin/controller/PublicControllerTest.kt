package com.parsec.aika.admin.controller

import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.boot.test.context.SpringBootTest
import javax.annotation.Resource

@SpringBootTest
internal class PublicControllerTest {

    @Resource
    private lateinit var publicController: PublicController

    @Test
    fun verifyCode() {
        // 获取验证码
        val result = publicController.verifyCode()
        assertEquals(result.code, 0)
        val codeInfo = result.data
        // 获取到的验证码对象中，clientCode以及图片的url都不为空
        assertNotNull(codeInfo.clientCode)
        assertNotNull(codeInfo.verifyCode)
    }
}