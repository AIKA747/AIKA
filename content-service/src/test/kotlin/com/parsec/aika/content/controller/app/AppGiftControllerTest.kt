package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.GetAppGiftReq
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource
import kotlin.test.assertEquals

@SpringBootTest
internal class AppGiftControllerTest {

    @Resource
    private lateinit var appGiftController: AppGiftController

    val loginUserInfo = LoginUserInfo().apply {
        this.userId = 10
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/init.sql")
    fun testGiftFun() {
        val list = appGiftController.getAppGift(
            com.parsec.aika.common.model.vo.req.GetAppGiftReq().apply { this.storyId = 1 }, loginUserInfo).data.list
        assertEquals(3, list.size)
        assertEquals("全局礼物", list.last().giftName)
    }
}
