package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import java.time.LocalDateTime

@TableName("`apple_notify`")
class AppleNotify {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    var body: String? = null

    var status: Int? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null
}