package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.controller.app.AppChatController
import com.parsec.aika.bot.model.vo.req.AppChatQueryVo
import com.parsec.aika.bot.model.vo.req.AppChatRecordQueryVo
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.test.assertEquals

@SpringBootTest
internal class AppChatControllerTest {

    @Resource
    private lateinit var appChatController: AppChatController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/chat_list_init.sql")
    fun getChatList() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100000
        }
        // 不传入查询条件查询数据
        var result = appChatController.getChatList(AppChatQueryVo(), loginUser)
        assertEquals(result.code, 0)
        assertTrue(result.data.list.size > 0)
        // 传入查询条件（botName）查询
        result = appChatController.getChatList(
            AppChatQueryVo().apply {
               this.botName = "机器人1"
        }, loginUser)
        assertEquals(result.code, 0)
        assertTrue(result.data.list.size > 0)
        assertTrue(result.data.list[0].botName!!.contains("机器人1"))
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/chat_list_init.sql")
    fun testDeleteAppBotId() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100000
        }

        // 传入没有的id，报错
        try {
            appChatController.deleteAppChatBotId(10086, loginUser)
            Assertions.fail()
        } catch (_: Exception) {
        }

        // 正常删除
        appChatController.deleteAppChatBotId(100001, loginUser)

        // 重复删除，报错
        try {
            appChatController.deleteAppChatBotId(100001, loginUser)
            Assertions.fail()
        } catch (_: Exception) {
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/chat_list_init.sql")
    fun getChatRecordsTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100000
        }
        // 查询条件不传入botId，报错
        try {
            appChatController.getChatRecords(AppChatRecordQueryVo(), loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "机器人id不能为空")
        }

        // 传入有聊天数据的botId、userId
        var result = appChatController.getChatRecords(AppChatRecordQueryVo().apply {
            this.botId = 1000000
        }, loginUser)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)

        // 传入时间查询条件（根据该时间能查出数据）
        result = appChatController.getChatRecords(AppChatRecordQueryVo().apply {
            this.botId = 1000000
            this.lastTime = "2023-01-06 00:00:00"
        }, loginUser)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)

        // 传入时间查询条件（根据该时间不能查出数据）
        result = appChatController.getChatRecords(AppChatRecordQueryVo().apply {
            this.botId = 1000000
            this.lastTime = "2026-01-05"
        }, loginUser)
        assertEquals(result.code, 0)
        assertEquals(result.data.total , 0)
    }

}