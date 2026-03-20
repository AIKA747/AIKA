package com.parsec.aika.bot.controller.app

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.service.RabbitMessageService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.BotTempMapper
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.RedisKeyPrefix
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.BotTemp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource
import kotlin.test.assertContains

@SpringBootTest
internal class AppSphereControllerTest {

    @Resource
    private lateinit var appSphereController: AppSphereController
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
    @Sql("/sql/AppSphereController.sql")
    fun spherePage() {
        val appSphere = appSphereController.appSphere(PageVo().apply { this.pageNo = 1;this.pageSize = 2 }, userInfo)
        assertEquals(appSphere.data.total, 5)
        assertEquals(appSphere.data.pages, 3)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppSphereController.sql")
    fun spherePageBot__no_collection_id() {
        // 使用 assertThrows 来捕获异常
        val exception = assertThrows(IllegalArgumentException::class.java) {
            appSphereController.appSphereBot(GetBotCollectionItemReq().apply {}, userInfo)
        }
        assertEquals("collectionId cannot be null", exception.message)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppSphereController.sql")
    fun spherePageBot() {
        val appSphereBot = appSphereController.appSphereBot(
            GetBotCollectionItemReq().apply { collectionId = 1;pageSize = 1 },
            userInfo
        )
        assertEquals(appSphereBot.data.total, 2)
        assertEquals(appSphereBot.data.pages, 2)
        assertEquals("l4",appSphereBot.data.list[0].listCoverDark)

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/AppSphereController.sql")
    fun testSpherePageBotDataIntegrity() {
        val appSphereBot = appSphereController.appSphereBot(
            GetBotCollectionItemReq().apply { collectionId = 1; pageSize = 2 },
            userInfo
        )

        val bot = appSphereBot.data.list.first()
        assertNotNull(bot.id)
        assertNotNull(bot.avatar)
        assertNotNull(bot.name)
        assertNotNull(bot.description)
        assertTrue(bot.avatar!!.contains("example.com"))
        assertTrue(bot.name!!.isNotEmpty())
        assertTrue(bot.description!!.isNotEmpty())
    }


}

