package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.em.Gender
import java.time.LocalDateTime


class GetAppMyBotsResp {

    /**
     * 机器人头像
     */
    var botAvatar: String? = null

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 机器人名称
     */
    var botName: String? = null

    /**
     * 机器人状态：Online,Offline
     */
    var botStatus: BotStatusEnum? = null

    /**
     * 会话数量
     */
    var chatTotal: Int? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

    /**
     * 用户关注机器人的最后一次读取时间
     */
    var lastReadAt: LocalDateTime? = null

    /**
     * 评分
     */
    var rating: Double? = null

    /**
     * 订阅者数量
     */
    var subscriberTotal: Int? = null

    /**
     * 机器人最新更新时间
     */
    var updatedAt: LocalDateTime? = null

    var dialogues: Int? = null

    var tags: List<String> ?= null
}
