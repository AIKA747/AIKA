package com.parsec.aika.bot.controller.app

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.model.vo.req.SubscribedBotQueryVo
import com.parsec.aika.bot.model.vo.req.SubscribedBotVo
import com.parsec.aika.bot.service.BotService
import com.parsec.aika.bot.service.RabbitMessageService
import com.parsec.aika.common.mapper.BotSubscriptionMapper
import com.parsec.aika.common.model.entity.BotSubscription
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource


@SpringBootTest
internal class SubscribedBotControllerTest {

    @Resource
    private lateinit var subscribedBotController: SubscribedBotController

    @Resource
    private lateinit var subscriptionMapper: BotSubscriptionMapper

    @MockBean
    private lateinit var botService: BotService

    @MockBean
    private lateinit var rabbitMessageService: RabbitMessageService

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_subscribed_init.sql")
    fun getSubscribedBots() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100000
        }
        var result = subscribedBotController.getSubscribedBots(SubscribedBotQueryVo(), loginUser)
        assertEquals(result.code, 0)
        assertTrue(result.data.list.size > 0)
        // 传入查询的机器人名称“eee”
        result = subscribedBotController.getSubscribedBots(
            SubscribedBotQueryVo().apply {
                this.botName = "eee"
            }, loginUser
        )
        assertEquals(result.code, 0)
        assertTrue(result.data.list.size > 0)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_subscribed_init.sql")
    fun subscribeBotTest() {
        Mockito.doNothing().`when`(botService).sayHello(Mockito.anyLong(), Mockito.anyLong(), Mockito.anyString())
        Mockito.doNothing().`when`(rabbitMessageService).subscribeBotRabbitMsg(Mockito.anyLong())

        val loginUser = LoginUserInfo().apply {
            this.userId = 100000
        }
        // 传入订阅的机器人不存在
        try {
            subscribedBotController.subscribeBot(SubscribedBotVo().apply {
                botId = 1000001
            }, loginUser)
            fail()
        } catch (_: Exception) {
        }
        // 传入的机器人未上架（已下架、未发布）
        try {
            subscribedBotController.subscribeBot(SubscribedBotVo().apply {
                botId = 1000001
            }, loginUser)
            fail()
        } catch (_: Exception) {
        }
        // 传入的机器人已订阅，不用在bot_subscription表中插入数据。调用订阅接口前后，该用户的订阅机器人数量相同
        val subscriptCount = subscriptionMapper.selectCount(
            KtQueryWrapper(BotSubscription::class.java).eq(
                BotSubscription::userId, loginUser.userId
            )
        )
        var result = subscribedBotController.subscribeBot(SubscribedBotVo().apply {
            botId = 1000000
        }, loginUser)
        assertEquals(result.code, 0)
        var subscriptCountAfter = subscriptionMapper.selectCount(
            KtQueryWrapper(BotSubscription::class.java).eq(
                BotSubscription::userId, loginUser.userId
            )
        )
        assertEquals(subscriptCount, subscriptCountAfter)
        // 传入的机器人存在，已上架。且用户未订阅，
        // 调用订阅接口后，该用户的订阅机器人数量比之前多一
        // 订阅数据（该机器人id、用户id）在调用订阅前无数据，订阅后有数据
        val botSubVo = subscriptionMapper.selectOne(
            KtQueryWrapper(BotSubscription::class.java).eq(
                BotSubscription::userId, loginUser.userId
            ).eq(BotSubscription::botId, 1000002)
        )
        assertNull(botSubVo)
        result = subscribedBotController.subscribeBot(SubscribedBotVo().apply {
            botId = 1000002
        }, loginUser)
        assertEquals(result.code, 0)
        subscriptCountAfter = subscriptionMapper.selectCount(
            KtQueryWrapper(BotSubscription::class.java).eq(
                BotSubscription::userId, loginUser.userId
            )
        )
        assertEquals(subscriptCount + 1, subscriptCountAfter)
        val botSubVoAfter = subscriptionMapper.selectOne(
            KtQueryWrapper(BotSubscription::class.java).eq(
                BotSubscription::userId, loginUser.userId
            ).eq(BotSubscription::botId, 1000002)
        )
        assertNotNull(botSubVoAfter)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/bot_subscribed_init.sql")
    fun unsubscribeBotTest() {
        Mockito.doNothing().`when`(rabbitMessageService).subscribeBotRabbitMsg(Mockito.anyLong())

        val loginUser = LoginUserInfo().apply {
            this.userId = 100000
        }
        // 传入的机器人与当前用户之间的订阅关系不存在
        try {
            subscribedBotController.unsubscribeBot(10101011111, loginUser)
            fail()
        } catch (_: Exception) {
        }
        // 传入的订阅关系存在，直接删除
        var botSubVo = subscriptionMapper.selectOne(
            KtQueryWrapper(BotSubscription::class.java).eq(BotSubscription::botId, 1000000)
                .eq(BotSubscription::userId, 100000).last("limit 1")
        )
        // 未调用接口前，能查询到订阅数据
        assertNotNull(botSubVo)
        val result = subscribedBotController.unsubscribeBot(1000000, loginUser)
        assertEquals(result.code, 0)
        // 调用接口成功后，无法查询到订阅数据
        botSubVo = subscriptionMapper.selectOne(
            KtQueryWrapper(BotSubscription::class.java).eq(BotSubscription::botId, 1000000)
                .eq(BotSubscription::userId, 100000).last("limit 1")
        )
        assertNull(botSubVo)
    }

}