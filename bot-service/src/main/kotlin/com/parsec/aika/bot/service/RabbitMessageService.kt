package com.parsec.aika.bot.service

import com.parsec.aika.common.model.em.ChatModule

/**
 * 发送消息到rabbitmq队列中，并更新当前用户**机器人数量
 */
interface RabbitMessageService {

    /**
     * 订阅、取消订阅机器人
     */
    fun subscribeBotRabbitMsg(userId: Long)

    /**
     * 删除、创建机器人
     */
    fun createBotRabbitMsg(userId: Long)

    /**
     * 机器人主动发消息给用户
     */
    fun sayHello(
        userId: Long,
        title: String,
        content: String,
        chatModule: ChatModule,
        username: String?,
        objectId: Long,
        avatar: String?
    )

    /**
     * 取消订阅机器人
     */
    fun unFollowBot(userId: Long?, botId: Long)

    /**
     * 订阅机器人
     */
    fun followBot(userId: Long?, botId: Long)
}