package com.parsec.aika.bot.controller.app

import cn.hutool.json.JSONUtil
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@AutoConfigureMockMvc
class AppGameMessageTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    private lateinit var loginUserInfo: LoginUserInfo

    @BeforeEach
    fun setUp() {
        loginUserInfo = LoginUserInfo().apply {
            userId = 1L
            username = "testUser"
            userType = UserTypeEnum.APPUSER
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql(scripts = ["classpath:sql/game_message_record.sql"])
    fun gameMessageRecord() {
        //查询全部
        mockMvc.perform(
            get("/app/game/chat/records").param("threadId", "1").header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.data.total").value(4))
        //查询指定时间之后的记录
        mockMvc.perform(
            get("/app/game/chat/records").param("threadId", "1").param("lastTime", "2025-01-15 08:52:02")
                .header("userInfo", JSONUtil.toJsonStr(loginUserInfo))
        ).andExpect(status().isOk).andExpect(jsonPath("$.data.total").value(2))
    }


}
