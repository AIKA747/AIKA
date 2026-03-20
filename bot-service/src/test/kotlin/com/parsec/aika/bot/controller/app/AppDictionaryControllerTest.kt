package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.controller.AppDictionaryController
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class AppDictionaryControllerTest {

    @Resource
    private lateinit var appDictionaryController: AppDictionaryController

    @Test
    @Rollback
    @Transactional
    fun getAppDicListTest() {
        var dicType = "botRules"
        var result = appDictionaryController.getAppDicList(dicType)
        assertEquals(result.code, 0)
        // 查询出的数据，dicType等于传入的dicType
        assertNotNull(result.data)
        result.data.map {
            assertEquals(it.dicType, dicType)
        }
    }
}