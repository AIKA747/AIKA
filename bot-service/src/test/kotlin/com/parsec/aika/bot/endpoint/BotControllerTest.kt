package com.parsec.aika.bot.endpoint

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@AutoConfigureMockMvc
class BotControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_name_check_test.sql")
    fun `checkBotNameExists should return true when bot exists`() {
        mockMvc.perform(
            get("/feign/bot/bot-name-check").param("name", "existingBot")
        ).andExpect(status().isOk).andExpect(content().string("true"))
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_name_check_test.sql")
    fun `checkBotNameExists should return false when bot does not exist`() {
        mockMvc.perform(
            get("/feign/bot/bot-name-check").param("name", "nonExistingBot")
        ).andExpect(status().isOk).andExpect(content().string("false"))
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_init.sql")
    fun createBotPost() {
        //已删除或不存在的机器人
        mockMvc.perform(
            get("/feign/bot/post/create").param("botId", "1")
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value(4001))
        //状态不是上线状态的机器人
        mockMvc.perform(
            get("/feign/bot/post/create").param("botId", "1000001")
        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value(4002))
        //正常发帖的机器人,通过apifox启动项目测试，mock content服务的feign接口未成功，后续完善
//        mockMvc.perform(
//            get("/feign/bot/post/create").param("botId", "1000000")
//        ).andExpect(status().isOk).andExpect(jsonPath("$.code").value(0))
    }
}
