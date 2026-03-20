package com.parsec.aika.bot.model.vo.resp

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate
import com.parsec.aika.common.model.em.BotSourceEnum
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.em.Gender
import java.time.LocalDateTime

@Translate(fields = ["botName", "recommendWords"])
class GetAppRecommendBotsResp {


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
     * 机器人头像
     */
    var botAvatar: String? = null

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
     * 评分
     */
    var rating: Double? = null

    /**
     * 订阅数量
     */
    var subscriberTotal: Int? = null

    /**
     * 性别：'MALE','FEMALE'
     */
    var gender: Gender? = null

    var updatedAt: LocalDateTime? = null
    var lastReadAt: LocalDateTime? = null


    /**
     * 机器人状态：unrelease,online,offline
     */
    var botStatus: BotStatusEnum? = null

    /**
     * 聊天数
     */
    var chatTotal: Int? = null

    var recommendImage: String? = null

    var recommendWords: String? = null

    var botIntroduce: String? = null

    /**
     * 相册
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var album: List<String>? = null

    var botSource: BotSourceEnum? = null

    var cover: String? = null

    @JsonIgnore
    var botImage: String? = null
}