package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

@TableName("interest_tags")
class InterestTags {

    @JsonSerialize(using = ToStringSerializer::class)
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    /**
     * 标签排序，升序排列
     */
    var sortNo: Int? = null

    /**
     * 标签名称
     */
    var tagName: String? = null

    /**
     * 创建人id
     */
    var creator: Long? = null

    /**
     * 更新人
     */
    var updater: Long? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null // 创建时间

    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null // 修改时间

    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null

    @TableLogic(value = "0", delval = "1")
    var deleted: Boolean? = null
}