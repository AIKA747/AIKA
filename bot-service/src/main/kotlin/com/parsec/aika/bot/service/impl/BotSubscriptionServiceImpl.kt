package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.kotlin.KtUpdateWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.req.SubscribedBotQueryVo
import com.parsec.aika.bot.model.vo.resp.BotListVo
import com.parsec.aika.bot.service.BotService
import com.parsec.aika.bot.service.BotSubscriptionService
import com.parsec.aika.bot.service.RabbitMessageService
import com.parsec.aika.common.mapper.BotMapper
import com.parsec.aika.common.mapper.BotSubscriptionMapper
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.entity.Bot
import com.parsec.aika.common.model.entity.BotImage
import com.parsec.aika.common.model.entity.BotSubscription
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource

@Service
class BotSubscriptionServiceImpl : BotSubscriptionService {

    @Resource
    private lateinit var botSubscriptionMapper: BotSubscriptionMapper

    @Resource
    private lateinit var botMapper: BotMapper

    @Resource
    private lateinit var botService: BotService

    @Resource
    private lateinit var rabbitMessageService: RabbitMessageService

    override fun mySubscribedBots(req: SubscribedBotQueryVo, user: LoginUserInfo): PageResult<BotListVo> {
        // 查询当前登录用户订阅的机器人
        PageHelper.startPage<BotListVo>(req.pageNo!!, req.pageSize!!)
        val subscribedBots = botSubscriptionMapper.appMySubscribedBots(req.botName, user.userId!!)
        subscribedBots.forEach {
            if (JSONUtil.isTypeJSONObject(it.botImage)) {
                val botImage = JSONUtil.toBean(it.botImage, BotImage::class.java)
                if (StrUtil.isNotBlank(botImage.avatar)) {
                    it.botAvatar = botImage.avatar
                }
                if (StrUtil.isNotBlank(botImage.cover)) {
                    it.cover = botImage.cover
                }
            }
        }
        return PageUtil<BotListVo>().page(subscribedBots)
    }

    override fun subscribedBot(botId: Long, user: LoginUserInfo) {
        // 订阅机器人
        // 若传入的机器人未发布，或已下线，则不允许订阅
        val bot = botMapper.selectById(botId)
        Assert.notNull(bot, "The robot does not exist")
        Assert.equals(
            bot.botStatus, BotStatusEnum.online, "The robot is not online and does not currently support subscriptions"
        )
        Assert.state(bot.creator != user.userId, "cannot subscribe to robots created by oneself")
        // 判断当前用户是否已订阅过该机器人
        val count = botSubscriptionMapper.selectCount(
            KtQueryWrapper(BotSubscription::class.java).eq(BotSubscription::botId, botId)
                .eq(BotSubscription::userId, user.userId)
        )
        if (count > 0) {
            StaticLog.info("User [{}] has subscribed to robot [{}]", user.username, bot.botName)
            return
        }
        // 未订阅过该机器人,保存订阅信息
        botSubscriptionMapper.insert(BotSubscription().apply {
            this.botId = botId
            this.userId = user.userId
            this.subscriptionAt = LocalDateTime.now()
        })
        //更新机器人订阅者数量
        updateBotSubscribeNum(bot.id)
        // 发送消息到rabbitmq队列中，并更新当前用户订阅机器人数量
        rabbitMessageService.subscribeBotRabbitMsg(user.userId!!)
        // 插入机器人欢迎语到message_record表中
        botService.sayHello(botId, user.userId!!, user.username)
        //同步机器人关注信息
        rabbitMessageService.followBot(user.userId, botId)
    }

    override fun unsubscribedBot(botId: Long, user: LoginUserInfo) {
        // 判断当前用户是否已订阅过该机器人
        val unsubNum = botSubscriptionMapper.delete(
            KtQueryWrapper(BotSubscription::class.java).eq(
                BotSubscription::botId, botId
            ).eq(BotSubscription::userId, user.userId)
        )
        if (unsubNum > 0) {
            //更新机器人订阅者数量
            updateBotSubscribeNum(botId)
            // 发送消息到rabbitmq队列中，并更新当前用户订阅机器人数量
            rabbitMessageService.subscribeBotRabbitMsg(user.userId!!.toLong())
        }
        //异步同步订阅数据
        rabbitMessageService.unFollowBot(user.userId, botId)
    }

    override fun feignSubscribedBotList(userId: Long, botIds: List<String>?): List<Long> {
        // 查询userId用户订阅的机器人id集合。
        // 当botIds为空时，返回当前用户订阅的所有机器人id集合。
        // 当botIds不为空时，返回botIds包含的订阅机器人id集合。
        return if (botIds.isNullOrEmpty()) botSubscriptionMapper.feignUserSubscribedBotIds(userId, null)
        else botSubscriptionMapper.feignUserSubscribedBotIds(userId, botIds)
    }

    override fun botSubscribedSyncInfo(botId: Long, userId: Long, botImage: BotImage?) {
        // 判断当前用户是否已订阅过该机器人
        val count = botSubscriptionMapper.selectCount(
            KtQueryWrapper(BotSubscription::class.java).eq(BotSubscription::botId, botId)
                .eq(BotSubscription::userId, userId)
        )
        if (count > 0) {
            botSubscriptionMapper.update(
                BotSubscription().apply { this.botImage = botImage },
                KtUpdateWrapper(BotSubscription::class.java).eq(BotSubscription::botId, botId)
                    .eq(BotSubscription::userId, userId)
            )
            return
        }
        // 未订阅过该机器人,保存订阅信息
        botSubscriptionMapper.insert(BotSubscription().apply {
            this.botId = botId
            this.userId = userId
            this.subscriptionAt = LocalDateTime.now()
            this.botImage = botImage
        })
        //更新机器人订阅者数量
        updateBotSubscribeNum(botId)
        // 发送消息到rabbitmq队列中，并更新当前用户订阅机器人数量
        rabbitMessageService.subscribeBotRabbitMsg(userId)
    }

    override fun botUnsubscribedSyncInfo(botId: Long, userId: Long) {
        // 判断当前用户是否已订阅过该机器人
        val unsubNum = botSubscriptionMapper.delete(
            KtQueryWrapper(BotSubscription::class.java).eq(
                BotSubscription::botId, botId
            ).eq(BotSubscription::userId, userId)
        )
        if (unsubNum > 0) {
            //更新机器人订阅者数量
            updateBotSubscribeNum(botId)
            // 发送消息到rabbitmq队列中，并更新当前用户订阅机器人数量
            rabbitMessageService.subscribeBotRabbitMsg(userId)
        }
    }

    private fun updateBotSubscribeNum(botId: Long) {
        botMapper.update(
            Bot().apply {
                this.subscriberTotal = botSubscriptionMapper.selectCount(
                    KtQueryWrapper(BotSubscription::class.java).eq(BotSubscription::botId, botId)
                )
            }, KtUpdateWrapper(Bot::class.java).eq(Bot::id, botId)
        )
    }
}