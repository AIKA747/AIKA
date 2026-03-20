package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("bot_rate")
class BotRate : BaseDomain() {

    /**
     * 被评价机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 用户姓名
     */
    var username: String? = null

    /**
     * 评价内容
     */
    var content: String? = null

    /**
     * 评分
     */
    var rating: Double? = null

    /**
     * 创建人id
     */
    var creator: String? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    /**
     * 更新人
     */
    var updater: String? = null

    /**
     * 提交时间
     */
    var commentAt: LocalDateTime? = null
}