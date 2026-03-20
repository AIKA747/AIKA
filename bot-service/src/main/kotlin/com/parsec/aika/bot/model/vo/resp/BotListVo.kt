package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotSourceEnum
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.em.Gender
import java.time.LocalDateTime

/**
 * 订阅的机器人vo
 */
class BotListVo {

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    val id: Long? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    val userId: Long? = null

    /**
     * 机器人头像
     */
    var botAvatar: String? = null

    /**
     * 机器人名称
     */
    val botName: String? = null

    /**
     * 机器人状态：online,offline
     */
    val botStatus: BotStatusEnum? = null

    /**
     * 会话数量
     */
    val chatTotal: Int? = null

    /**
     * 创建人id
     */
    val creator: String? = null

    /**
     * 创建人名称
     */
    val creatorName: String? = null

    /**
     * 性别
     */
    val gender: Gender? = null

    /**
     * 用户关注机器人的最后一次读取时间
     */
    val lastReadAt: LocalDateTime? = null

    /**
     * 评分
     */
    val rating: Double? = null

    /**
     * 订阅者数量
     */
    val subscriberTotal: Int? = null

    /**
     * 机器人最新更新时间
     */
    val updatedAt: LocalDateTime? = null

    /**
     * builtIn，userCreated
     */
    var botSource: BotSourceEnum? = null

    var cover: String? = null

    @JsonIgnore
    var botImage: String? = null

}