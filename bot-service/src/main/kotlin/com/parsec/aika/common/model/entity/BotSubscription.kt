package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import java.time.LocalDateTime

@TableName("bot_subscription", autoResultMap = true)
class BotSubscription {

    /**
     * id，主键id
     */
    var id: Long? = null

    /**
     * 机器人id
     */
    var botId: Long? = null

    /**
     * 用户id
     */
    var userId: Long? = null

    /**
     * 最后一次读取时间
     */
    var lastReadAt: LocalDateTime? = null

    /**
     * 订阅时间
     */
    var subscriptionAt: LocalDateTime? = null

    // 机器人的形象相关信息，包含封面和头像地址等
    @TableField(typeHandler = JacksonTypeHandler::class)
    var botImage: BotImage? = null
}