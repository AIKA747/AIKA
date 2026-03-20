package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import java.time.LocalDateTime

open class BaseDomain {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null

    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null

    @TableLogic(value = "0", delval = "1")
    var deleted: Boolean? = null

}