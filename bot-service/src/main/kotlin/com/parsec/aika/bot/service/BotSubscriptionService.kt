package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.SubscribedBotQueryVo
import com.parsec.aika.bot.model.vo.resp.BotListVo
import com.parsec.aika.common.model.entity.BotImage
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

interface BotSubscriptionService {

    /**
     * 查询当前登录用户订阅的机器人列表
     */
    fun mySubscribedBots(req: SubscribedBotQueryVo, user: LoginUserInfo): PageResult<BotListVo>

    /**
     * 订阅机器人
     */
    fun subscribedBot(botId: Long, user: LoginUserInfo)

    /**
     * 取消订阅机器人
     */
    fun unsubscribedBot(botId: Long, user: LoginUserInfo)

    /**
     * feign接口查询指定用户的订阅机器人id集合
     * 返回userId对应用户订阅的机器人id集合。
     * 当botIds为空时，返回当前用户订阅的所有机器人id集合。
     * 当botIds不为空时，返回botIds包含的订阅机器人id集合。
     * userId：指定用户id
     * botIds：传入的机器人id
     */
    fun feignSubscribedBotList(userId: Long, botIds: List<String>?): List<Long>

    /**
     * 机器人订阅同步信息
     */
    fun botSubscribedSyncInfo(botId: Long, userId: Long, botImage: BotImage?)

    /**
     * 机器人取消订阅消息
     */
    fun botUnsubscribedSyncInfo(botId: Long, userId: Long)

}