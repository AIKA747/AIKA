package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.controller.manage.ManageBotDigitalController
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.ProfileType
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.DigitalHumanProfile
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class ManageBotDigitalControllerTest {

    @Resource
    private lateinit var manageBotDigitalController: ManageBotDigitalController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_init.sql")
    fun digitalHumanProfileDetail() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入的botId，无法查询到机器人信息，报错
        try {
            manageBotDigitalController.digitalHumanProfileDetail(ProfileType.bot, 121212121, Gender.MALE, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The robot information does not exist")
        }
        // 传入的botId，未开启数字人配置模式，报错
        try {
            manageBotDigitalController.digitalHumanProfileDetail(ProfileType.bot, 1000000, Gender.MALE, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该机器人未开通数字人配置信息")
        }
        // 传入的botId，能查询到机器人信息，无法查询到机器人配置信息，报错
        try {
            manageBotDigitalController.digitalHumanProfileDetail(ProfileType.bot, 1000002, Gender.MALE, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该机器人的配置信息不存在")
        }
        // 查询到bot信息
        val result = manageBotDigitalController.digitalHumanProfileDetail(ProfileType.bot, 1000001, Gender.MALE, loginUser)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
        assertEquals(result.data.objectId, 1000001)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_init.sql")
    fun updateDigitalHumanProfileTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        val updVo = DigitalHumanProfile().apply {
            this.greetVideo = "dfdsf"
        }
        // 传入的botId，无法查询到机器人信息，报错
        try {
            updVo.profileType = ProfileType.bot
            updVo.objectId = 121212121
            manageBotDigitalController.updateDigitalHumanProfile(updVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The robot information does not exist")
        }
        // 传入的botId，未开启数字人配置模式，报错
        try {
            updVo.profileType = ProfileType.bot
            updVo.objectId = 1000000
            manageBotDigitalController.updateDigitalHumanProfile(updVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该机器人未开通数字人配置信息")
        }
        // 传入的botId，能查询到机器人信息，无法查询到机器人配置信息，报错
        try {
            updVo.profileType = ProfileType.bot
            updVo.objectId = 1000002
            manageBotDigitalController.updateDigitalHumanProfile(updVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该机器人的配置信息不存在")
        }
        updVo.profileType = ProfileType.bot
        updVo.objectId = 1000001
        val result = manageBotDigitalController.updateDigitalHumanProfile(updVo, loginUser)
        assertEquals(result.code, 0)
    }
}