package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.io.Serializable
import java.time.LocalDateTime

/**
 * 玩家通关后的累计得分记录表
 */
@TableName("t_rewards")
class Rewards : Serializable {

    //id
    @TableId
    var id: Long? = null

    // 累计分数
    var reward: Int? = null

    // 用户id
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null

    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null
}