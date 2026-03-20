package com.parsec.aika.bot.controller.app

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.service.RabbitMessageService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.BotTempMapper
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.RedisKeyPrefix
import com.parsec.aika.common.model.entity.BotTemp
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource
import kotlin.test.assertContains

@SpringBootTest
internal class AppBotControllerTest {

    @Resource
    private lateinit var appBotController: AppBotController

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var botTempMapper: BotTempMapper

    @MockBean
    private lateinit var rabbitMessageService: RabbitMessageService


    @Resource
    lateinit var stringRedisTemplate: StringRedisTemplate

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_subscribed_init.sql")
    fun getBotInfo() {
        val botUserId = 100000L
        val notBotUserId = 10011000L
        // 传入不对的botId
        try {
            appBotController.getBotInfo(1010101111, null, LoginUserInfo().apply {
                this.userId = botUserId
            })
            fail()
        } catch (_: Exception) {
        }
        // 传入有数据的botId，但其userId不是传入的userId
        // ①非机器人作者访问此接口，则直接返回Bot的相关信息。如果机器人已下架（botStatus=offline），则返回此机器人已下架的提示即可。
        var botResult = appBotController.getBotInfo(1000000, null, LoginUserInfo().apply {
            this.userId = notBotUserId
        })
        assertEquals(botResult.code, 0)
        assertEquals(botResult.data.id, 1000000)
        assertNotEquals(botResult.data.creator, notBotUserId)
        // 查询的bot数据已下架（botStatus=offline）
        try {
            appBotController.getBotInfo(1000001, null, LoginUserInfo().apply {
                this.userId = notBotUserId
            })
            fail()
        } catch (_: Exception) {
        }
        // ②机器人作者访问此接口，先取Bot_temp表里publishTime为空的记录，存在就返回之，如果不存在，则取Bot的记录返回之。
        // bot_temp表中不存在该对应数据publishTime为空的记录
        botResult = appBotController.getBotInfo(1000003, null, LoginUserInfo().apply {
            this.userId = botUserId
        })
        var botTempCount = botTempMapper.selectCount(
            KtQueryWrapper(BotTemp::class.java).eq(BotTemp::botId, 1000003).isNull(BotTemp::publishTime)
        )
        assertEquals(botResult.code, 0)
        assertEquals(botResult.data.id, 1000003)
        assertEquals(botTempCount, 0)
        // 返回的bot_temp的数据
        botResult = appBotController.getBotInfo(1000000, null, LoginUserInfo().apply {
            this.userId = botUserId
        })
        botTempCount = botTempMapper.selectCount(
            KtQueryWrapper(BotTemp::class.java).eq(BotTemp::botId, 1000000).isNull(BotTemp::publishTime)
        )
        assertEquals(botResult.code, 0)
        assertEquals(botResult.data.id, 1000000)
        assertTrue(botTempCount > 0)
    }

    @Test
    @Rollback
    @Transactional
    fun testBot() {
        val user = LoginUserInfo().apply {
            this.userId = 1
        }
        // 新建
        val id = appBotController.postAppBot(PostAppBotReq().apply {
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
        }, user).data.id

        assertNotNull(id)

        // 修改
        appBotController.putAppBotId(id!!, PutAppBotIdReq().apply {
            this.avatar = "www.avatar.com"
            this.botCharacter = "tedian"
            this.botIntroduce = "jieshao"
            this.botName = "xiugaile"
            this.categoryId = 1001
            this.categoryName = "fenlanmingcheng"
            this.conversationStyle = "huidafengge"
            this.gender = Gender.HIDE
            this.personalStrength = "gerenshili"
            this.profession = "zhiye"
            this.rules = listOf()
            this.visibled = true
            this.age = 21
        }, user)

        // 发布
        appBotController.putAppBotIdRelease(id, user)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_init.sql")
    fun testBotList() {
        val user = LoginUserInfo().apply {
            this.userId = 1
        }        // 列表
        val appMyBots = appBotController.getAppMyBots(GetAppMyBotsReq().apply { this.botName = "ces" }, user)
        assertEquals(appMyBots.data.total, 1)
        assertEquals(appMyBots.data.list.last().botAvatar, "http://l")
        assertEquals(appMyBots.data.list.last().botName, "ces")
        assertEquals(appMyBots.data.list.last().botStatus, BotStatusEnum.offline)
        assertEquals(appMyBots.data.list.last().chatTotal, 1)
        assertEquals(appMyBots.data.list.last().creator, 1)
        assertEquals(appMyBots.data.list.last().creatorName, "aaa")
        assertEquals(appMyBots.data.list.last().gender, Gender.HIDE)
        assertEquals(appMyBots.data.list.last().rating, 21.0)
        assertEquals(appMyBots.data.list.last().subscriberTotal, 12)
        assertEquals(appMyBots.data.list.last().updatedAt, LocalDateTime.parse("2024-01-02T16:53:38"))


    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_category_init.sql")
    fun testCate() {
        val appBotCategory =
            appBotController.getAppBotCategory(GetAppBotCategoryReq().apply { this.categoryName = "lanmuming" })
        assertEquals(appBotCategory.data.total, 1)
        assertEquals(appBotCategory.data.list.last().categoryName, "lanmuming")
        assertEquals(appBotCategory.data.list.last().introduction, "introduction")
        assertTrue(appBotCategory.data.list.last().tags!!.isNotEmpty())
        assertNotNull(appBotCategory.data.list.last().cover)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_subscribed_init.sql")
    fun deleteBotTest() {
        Mockito.doNothing().`when`(rabbitMessageService).createBotRabbitMsg(Mockito.anyLong())

        // 传入不存在的机器人id
        try {
            appBotController.deleteBot(1022111, LoginUserInfo().apply {
                this.userId = 100000
            })
            fail()
        } catch (_: Exception) {
        }
        // 传入的机器人id的作者不是当前登录用户
        try {
            appBotController.deleteBot(1000000, LoginUserInfo().apply {
                this.userId = 1000022
            })
            fail()
        } catch (_: Exception) {
        }
        // 传入当前登录用户创建的机器人id
        val result = appBotController.deleteBot(1000000, LoginUserInfo().apply {
            this.userId = 100000
        })
        assertEquals(result.code, 0)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_subscribed_init.sql")
    fun testExploreBots() {
        val key = "asdf"
        appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.type = 1
            this.keyword = key
        }, LoginUserInfo())
        assertTrue((stringRedisTemplate.opsForZSet().score(RedisKeyPrefix.botkeywordexplore.name, key) ?: 0.0) > 0.0)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_init.sql")
    fun testOwnerBots() {
        val list = appBotController.getAppOwnerBots(GetAppOwnerBotsReq().apply {
            this.botOwnerIds = "1"
        }).data.list
        assertEquals(list.last().botAvatar, "http://l")
        assertEquals(list.last().botName, "eee")
        assertEquals(list.last().botStatus, BotStatusEnum.online)
        assertEquals(list.last().chatTotal, 1)
        assertEquals(list.last().creator, 1)
        assertEquals(list.last().creatorName, "aaa")
        assertEquals(list.last().gender, Gender.HIDE)
        assertEquals(list.last().rating, 21.0)
        assertEquals(list.last().subscriberTotal, 12)
        assertEquals(list.last().updatedAt, LocalDateTime.parse("2024-01-02T16:53:38"))
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_init.sql")
    fun testRecommendBots() {
        val list = appBotController.getAppRecommendBots(GetAppRecommendBotsReq().apply {
            this.botName = "e"
        }, LoginUserInfo().apply { this.userId = 1 }).data.list
        assertEquals(list.last().botAvatar, "http://l")
        assertEquals(list.last().botName, "eee")
        assertEquals(list.last().botStatus, BotStatusEnum.online)
        assertEquals(list.last().chatTotal, 1)
        assertEquals(list.last().creator, 1)
        assertEquals(list.last().creatorName, "aaa")
        assertEquals(list.last().gender, Gender.HIDE)
        assertEquals(list.last().rating, 21.0)
        assertEquals(list.last().subscriberTotal, 12)
        assertEquals(list.last().updatedAt, LocalDateTime.parse("2024-01-02T16:53:38"))
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_tags_init.sql")
    fun testTagExploreBots() {
        val appExploreBots = appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.categoryId = "1"
        }, LoginUserInfo())
        assertEquals(appExploreBots.data.total, 1)
        val appExploreBots1 = appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.tag = "ab"
        }, LoginUserInfo())
        assertEquals(appExploreBots1.data.total, 1)
        assertContains(appExploreBots1.data.list.first().tags!!.split(","), "ab")
        val appExploreBots2 = appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.tag = "bbb"
        }, LoginUserInfo())
        assertEquals(appExploreBots2.data.total, 2)
        assertContains(appExploreBots1.data.list.first().tags!!.split(","), "bbb")
        assertContains(appExploreBots1.data.list.last().tags!!.split(","), "bbb")
        val appExploreBots3 = appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.categoryId = "1"
            this.tag = "abc"
        }, LoginUserInfo())
        assertEquals(appExploreBots3.data.total, 0)
        val appExploreBots4 = appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.tag = "a"
        }, LoginUserInfo())
        assertEquals(appExploreBots4.data.total, 0)



        appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.categoryId = "1"
            this.tag = "bbb"
        }, LoginUserInfo()).let {
            assertEquals(it.data.total, 1)  // 只返回符合分类为 1 且包含 "bbb" 标签的机器人
            assertContains(it.data.list.first().tags!!.split(","), "bbb")
        }



        // 无tag作为条件，则返回所有的机器人

        appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.tag = null
        }, LoginUserInfo()).let {
            assertEquals(2,it.data.total)
        }


        appBotController.getAppExploreBots(GetAppExploreBotsReq().apply {
            this.tag = ""
        }, LoginUserInfo()).let {
            assertEquals(2,it.data.total)
        }

    }
}

