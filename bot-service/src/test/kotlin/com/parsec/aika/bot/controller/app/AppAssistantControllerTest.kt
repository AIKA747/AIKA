package com.parsec.aika.bot.controller.app

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.controller.app.AppAssistantController
import com.parsec.aika.bot.model.vo.req.AppAssistantGenderReq
import com.parsec.aika.bot.model.vo.req.AppAssistantMsgRecordQueryVo
import com.parsec.aika.common.mapper.UserAssistantMapper
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.UserAssistant
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*
import javax.annotation.Resource

@SpringBootTest
internal class AppAssistantControllerTest {

    @Resource
    private lateinit var controller: AppAssistantController

    @Resource
    private lateinit var userAssistantMapper: UserAssistantMapper

    private var userInfo: LoginUserInfo = LoginUserInfo()

    @BeforeEach
    fun setBefore() {
        userInfo = LoginUserInfo().apply {
            this.userId = 1000
            this.userType = UserTypeEnum.APPUSER
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/assistant_init.sql")
    fun getAssistantInfoTest() {
        val result = controller.getAssistantInfo(userInfo)
        assertEquals(result.code, 0)
        // 包含了设置的助手性别
        assertNotNull(result.data.userSettingGender)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/assistant_init.sql")
    fun setAssistantGenderTest() {
        val updVo = AppAssistantGenderReq().apply {
            this.assistantId = 1000
            this.gender = Gender.FEMALE
        }
        // 当没有用户与助手的关联信息时，会创建一个关联，并设置它的助手性别
        var userAssistantVo = userAssistantMapper.selectOne(
            KtQueryWrapper(UserAssistant::class.java).eq(
                UserAssistant::userId,
                userInfo.userId
            ).last("limit 1")
        )
        if (Objects.isNull(userAssistantVo)) {
            val result = controller.setAssistantGender(updVo, userInfo)
            assertEquals(result.code, 0)
            userAssistantVo = userAssistantMapper.selectOne(
                KtQueryWrapper(UserAssistant::class.java).eq(
                    UserAssistant::userId,
                    userInfo.userId
                ).last("limit 1")
            )
            assertNotNull(userAssistantVo)
            assertEquals(userAssistantVo.gender, updVo.gender)
        } else {
            val result = controller.setAssistantGender(updVo, userInfo)
            assertEquals(result.code, 0)
            val userAssistantAfterVo = userAssistantMapper.selectOne(
                KtQueryWrapper(UserAssistant::class.java).eq(
                    UserAssistant::userId,
                    userInfo.userId
                ).last("limit 1")
            )
            assertNotNull(userAssistantAfterVo)
            assertEquals(userAssistantAfterVo.gender, updVo.gender!!.name)
            assertEquals(userAssistantAfterVo.id, userAssistantVo.id)
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/assistant_init.sql")
    fun getChatRecordTest() {
        val queryVo = AppAssistantMsgRecordQueryVo()
        var result = controller.getChatRecord(queryVo, userInfo)
        assertEquals(result.code, 0)
        // 添加查询条件：日期
        queryVo.lastTime = "2024-03-01 12:22:22"
        result = controller.getChatRecord(queryVo, userInfo)
        assertEquals(result.code, 0)
        result.data.list.map {
            assertTrue(
                it.createdAt!!.isAfter(
                    LocalDateTime.parse(
                        queryVo.lastTime,
                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                    )
                )
            )
        }
    }
}