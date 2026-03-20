package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotSourceEnum
import com.parsec.aika.common.model.em.BotStatusEnum
import java.time.LocalDateTime

class AppChatListVo {

    /**
     * 机器人头像
     */
    var botAvatar: String? = null

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null

    /**
     * 机器人名称
     */
    var botName: String? = null

    /**
     * 机器人状态：Online,Offline
     */
    var botStatus: BotStatusEnum? = null

    /**
     * 机器人创建者的id
     */
    var creator: String? = null

    /**
     * 机器人创建者的名称
     */
    var creatorName: String? = null

    /**
     * 对话数量
     */
    var dialogues: Int? = null

    /**
     * 最后一次发消息时间
     */
    var lastMessageAt: LocalDateTime? = null

    /**
     * 最后一次读消息时间
     */
    var lastReadAt: LocalDateTime? = null

    /**
     * 是否当前用户创建
     */
    var selfCreation: Boolean? = null

    var botSource: BotSourceEnum? = null

    var subscribed: Boolean? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 机器人介绍
     */
    var botIntroduce: String? = null
}