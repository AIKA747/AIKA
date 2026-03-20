package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.io.Serializable
import java.time.LocalDateTime

/**
 * 获得礼品的记录
 */
@TableName("t_gift_recorder")
class GiftRecorder : Serializable {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    // 游戏记录表id
    @JsonSerialize(using = ToStringSerializer::class)
    var storyRecorderId: Long? = null

    // 礼物id
    @JsonSerialize(using = ToStringSerializer::class)
    var giftId: Long? = null

    // 每个礼物增加的友好分
    var friendDegree: Int? = null

    // 每个礼物增加的情节分
    var storyDegree: Int? = null

    // 用户id
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    // 创建时间
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

}