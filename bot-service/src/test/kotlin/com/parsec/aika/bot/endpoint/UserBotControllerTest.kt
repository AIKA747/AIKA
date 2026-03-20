package com.parsec.aika.bot.endpoint

import com.parsec.aika.bot.endpoint.UserBotController
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class UserBotControllerTest {

    @Resource
    private lateinit var userBotController: UserBotController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/chat_list_init.sql")
    fun subscribeBots() {
        // 传入没有订阅机器人的用户id
        var result = userBotController.subscribeBots(10101000001, null)
        assertEquals(result.size, 0)
        // 传入有订阅机器人的用户id，空的机器人id范围。返回该用户订阅的所有机器人id集合
        result = userBotController.subscribeBots(100000, null)
        assertTrue(result.isNotEmpty())
        // 传入有订阅机器人的用户id，限制的机器人id范围。返回该用户订阅的在限制范围内的机器人id集合
        val botIds = mutableListOf<String>()
        botIds.add("1000001")
        result = userBotController.subscribeBots(100000, botIds)
        assertEquals(result.size, 1)
        assertEquals(result[0], 1000001)
    }
}