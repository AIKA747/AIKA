package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.controller.app.AppRateController
import com.parsec.aika.bot.model.vo.req.GetAppRateReq
import com.parsec.aika.bot.model.vo.req.PostAppRateReq
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource

@SpringBootTest
internal class AppRateControllerTest {

    @Resource
    private lateinit var appRateController: AppRateController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/rate_init.sql")
    fun testGetAppRate() {
        val data = appRateController.getAppRate(GetAppRateReq().apply {
            this.botId = 10001
        }).data
        assertEquals(data.total, 1)
        assertEquals(data.list.last().botId, 10001)
        assertEquals(data.list.last().userId, 10000)
        assertEquals(data.list.last().username, "username")
        assertEquals(data.list.last().content, "good")
        assertEquals(data.list.last().rating, 9.9)
        assertEquals(data.list.last().commentAt, LocalDateTime.parse("2024-01-04T17:03:27"))

    }
    @Test
    @Rollback
    @Transactional
    fun testPostAppRate() {
        assertEquals(appRateController.postAppRate(PostAppRateReq().apply {
            this.botId = 100001
            this.rating = 9.9
            this.content = "very good!"
        }, LoginUserInfo().apply {
            this.userId = 100001
            this.username = "tom"
        }).code, 0)
    }
}