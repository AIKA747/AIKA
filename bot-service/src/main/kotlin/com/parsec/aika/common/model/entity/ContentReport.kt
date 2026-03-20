package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

@TableName("content_report", autoResultMap = true)
class ContentReport {

    @JsonSerialize(using = ToStringSerializer::class)
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    var userId: Long? = null

    var reportType: ReportType? = null

    var json: String? = null

    /**
     * 状态：0待处理，1已处理
     */
    var status: Int? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null // 创建时间

    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null // 修改时间

}

enum class ReportType {
    bot, msg
}