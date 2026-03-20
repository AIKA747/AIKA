package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.service.AssistantRecommendService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource

@SpringBootTest
internal class ManageBotControllerTest {

    @Resource
    private lateinit var manageBotController: ManageBotController

    @Resource
    private lateinit var assistantRecommendService: AssistantRecommendService

    @Resource
    private lateinit var botMapper: BotMapper



    @Test
    @Rollback
    @Transactional
    @Sql("/sql/recommend_init.sql")
    fun botRecommend() {
        val botRecommend = assistantRecommendService.botRecommend(1, listOf("篮球", "足球"), RecommendStrategy.popular)!!
        assertEquals(botRecommend.id, "1000000")
        assertEquals(botRecommend.botName, "eee")
        assertEquals(botRecommend.botIntroduce, "asfd")
        assertEquals(botRecommend.avatar, "http://l")
        assertEquals(botRecommend.gender, Gender.HIDE)

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_init.sql")
    fun botRecommendDetail() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入的botId，无法查询到机器人信息，报错
        try {
            manageBotController.botRecommendDetail(121212121, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The robot information does not exist")
        }
        // 查询到bot信息
        val result = manageBotController.botRecommendDetail(1000000, loginUser)
        assertNotNull(result)
        assertEquals(result.code, 0)
        assertEquals(result.data.botId, 1000000)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_init.sql")
    fun botDetailTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入的botId，无法查询到机器人信息，报错
        try {
            manageBotController.botRecommendDetail(121212121, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The robot information does not exist")
        }
        // 查询到bot信息
        val result = manageBotController.botRecommendDetail(1000000, loginUser)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
        assertEquals(result.data.botId, 1000000)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_init.sql")
    fun cancelRecommendationTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入的botId，无法查询到机器人信息，报错
        try {
            manageBotController.cancelRecommendation(121212121, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The robot information does not exist")
        }
        // 取消推荐，传入本身就是未推荐的机器人id，直接返回成功
        var result = manageBotController.cancelRecommendation(1000000, loginUser)
        assertEquals(result.code, 0)
        // 取消推荐，传入本身就是已推荐的机器人id，修改并返回成功
        result = manageBotController.cancelRecommendation(1000001, loginUser)
        assertEquals(result.code, 0)
        val bot1 = botMapper.selectById(1000001)
        assertEquals(bot1.recommend, false)

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_init.sql")
    fun testManageBotRecommend() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
        }
        // 设置排序
        manageBotController.putManageBotRecommendSort(PutManageBotRecommendSortReq().apply {
            this.botId = 1000001
            this.sortNo = 99
        }, loginUser)

        // 设置推荐
        manageBotController.putManageBotRecommend(PutManageBotRecommendReq().apply {
            this.botId = 1000000
            this.recommendImage = "http:www.image.com/123"
            this.recommendWords = "我非常推荐"
        }, loginUser)

        // 查询到bot信息
        val result = manageBotController.getManageBotRecommend(GetManageBotRecommendReq().apply {
            this.botName = "e"
            this.categoryId = 1
        }, loginUser)
        assertNotNull(result)
        assertEquals(result.data.total, 2)
        assertEquals(result.data.list.last().botSource, BotSourceEnum.builtIn)
        assertEquals(result.data.list.last().sortNo, 99)
        assertEquals(result.data.list.last().recommendImage, "asdf")
        assertEquals(result.data.list.last().recommendWords, "adsf")
    }



    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_init.sql")
    fun testManageBotStatus() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
        }
        // 下线
        manageBotController.putManageBotStatus(PutManageBotStatusReq().apply {
            this.botId = 1000000
            this.botStatus = BotStatusEnum.offline
        }, loginUser)

        assertEquals(botMapper.selectById(1000000).botStatus, BotStatusEnum.offline)
    }

    @Test
    @Rollback
    @Transactional
    fun testPostManageBot() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
        }
        // 新建
        val id = manageBotController.postManageBot(PostManageBotReq().apply {
            this.avatar = "www.avatar.com"
            this.botCharacter = "tedian"
            this.botIntroduce = "jieshao"
            this.botName = "mingcheng"
            this.categoryId = 1001
            this.categoryName = "fenlanmingcheng"
            this.conversationStyle = "huidafengge"
            this.gender = Gender.HIDE
            this.personalStrength = "gerenshili"
            this.profession = "zhiye"
            this.rules = listOf()
            this.visibled = true
            this.age = 18
        }, loginUser).data.toLong()
        assertNotNull(botMapper.selectById(id))
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_init.sql")
    fun testGetManageBot() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
        }
        val result = manageBotController.getManageBots(GetManageBotsReq().apply {
            this.botName = "ces"
            this.botSource = BotSourceEnum.builtIn
            this.categoryId = 1
        }, loginUser)
        assertEquals(result.data.total, 2)
        assertEquals(result.data.list.last().botName, "ces")
        assertEquals(result.data.list.last().chatTotal, 1)
        assertEquals(result.data.list.last().creator, 1)
        assertEquals(result.data.list.last().botStatus, BotStatusEnum.offline)
        assertEquals(result.data.list.last().createdAt, LocalDateTime.parse("2024-01-02T16:53:31"))
        assertEquals(result.data.list.last().categoryName, "asdf")
        assertEquals(result.data.list.last().recommend, true)

    }
}
