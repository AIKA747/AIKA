package com.parsec.aika.bot.service.impl

import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.config.FollowRelationMqConst.FOLLOW_BOT_RELATION_ROUTE_KEY
import com.parsec.aika.bot.config.FollowRelationMqConst.FOLLOW_RELATION_EXCHANGE
import com.parsec.aika.bot.config.FollowRelationMqConst.UNFOLLOW_BOT_RELATION_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.USER_BOT_INFO_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.USER_COUNT_DIRECT_EXCHANGE
import com.parsec.aika.bot.config.RabbitmqConst.USER_NOTIFY_EXCHANGE
import com.parsec.aika.bot.config.RabbitmqConst.USER_NOTIFY_ROUTE_KEY
import com.parsec.aika.bot.config.RabbitmqConst.USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY
import com.parsec.aika.bot.service.NotificationService
import com.parsec.aika.bot.service.RabbitMessageService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.BotSubscriptionMapper
import com.parsec.aika.common.model.bo.FollowRelationBO
import com.parsec.aika.common.model.dto.BotNotifyContent
import com.parsec.aika.common.model.em.ChatModule
import com.parsec.aika.common.model.em.ChatroomNotifyType
import com.parsec.aika.common.model.entity.Bot
import com.parsec.aika.common.model.entity.BotSubscription
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource

@Service
class RabbitMessageServiceImpl : RabbitMessageService {

    @Resource
    private lateinit var botSubscriptionMapper: BotSubscriptionMapper

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    @Resource
    private lateinit var notificationService: NotificationService

    override fun subscribeBotRabbitMsg(userId: Long) {
        // 查询传入用户当前订阅的机器人数量
        val count = botSubscriptionMapper.selectCount(
            KtQueryWrapper(BotSubscription::class.java).eq(
                BotSubscription::userId, userId
            )
        )
        rabbitTemplate.convertAndSend(
            USER_COUNT_DIRECT_EXCHANGE,
            USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY,
            JSONUtil.toJsonStr(this.makeMessageVo(userId, count))
        )
    }

    override fun createBotRabbitMsg(userId: Long) {
        // 查询传入用户创建的机器人数量
        val count = botMapper.selectCount(KtQueryWrapper(Bot::class.java).eq(Bot::creator, userId))
        rabbitTemplate.convertAndSend(
            USER_COUNT_DIRECT_EXCHANGE, USER_BOT_INFO_ROUTE_KEY, JSONUtil.toJsonStr(this.makeMessageVo(userId, count))
        )
    }

    override fun sayHello(
        userId: Long,
        title: String,
        content: String,
        chatModule: ChatModule,
        username: String?,
        objectId: Long,
        avatar: String?
    ) {
        if (chatModule == ChatModule.bot) {
            notificationService.chatMessageNotify(listOf(userId), title, content, BotNotifyContent().apply {
                this.id = objectId.toString()
                this.botId = objectId
                this.botName = title
                this.botAvatar = avatar
                this.type = ChatroomNotifyType.BOT_REMINDER
            })
        } else {
            // 发送消息到rabbitmq队列中，更新当前用户订阅机器人数量
            val messageVo = JSONObject()
            messageVo.set("userId", userId)
            messageVo.set("username", username)
            messageVo.set("title", title)
            messageVo.set("module", chatModule.name)
            messageVo.set("content", content)
            messageVo.set("objectId", objectId)
            rabbitTemplate.convertAndSend(
                USER_NOTIFY_EXCHANGE, USER_NOTIFY_ROUTE_KEY, messageVo.toString()
            )
        }
    }

    override fun unFollowBot(userId: Long?, botId: Long) {
        val followRelationBO = FollowRelationBO().apply {
            this.creator = userId
            this.followingId = botId
        }
        rabbitTemplate.convertAndSend(
            FOLLOW_RELATION_EXCHANGE, UNFOLLOW_BOT_RELATION_ROUTE_KEY, JSONUtil.toJsonStr(followRelationBO)
        )
    }

    override fun followBot(userId: Long?, botId: Long) {
        val followRelationBO = FollowRelationBO().apply {
            this.creator = userId
            this.followingId = botId
        }
        rabbitTemplate.convertAndSend(
            FOLLOW_RELATION_EXCHANGE, FOLLOW_BOT_RELATION_ROUTE_KEY, JSONUtil.toJsonStr(followRelationBO)
        )
    }

    private fun makeMessageVo(userId: Long, count: Int): JSONObject {
        // 发送消息到rabbitmq队列中，更新当前用户订阅机器人数量
        val messageVo = JSONObject()
        messageVo.set("userId", userId)
        messageVo.set("count", count)
        messageVo.set("updateAt", LocalDateTime.now())
        return messageVo
    }
}