package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

@TableName("app_error_logs")
class AppErrorLogs {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    var userId: String? = null

    /**
     * device varchar(255) NULL设备
     */
    var device: String? = null

    /**
     *systemVersion varchar(255) NULL系统版本
     */
    var systemVersion: String? = null

    /**
     * 日志文件地址
     */
    var logFileUrl: String? = null

    /**
     * 备注
     */
    var remark: String? = null

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    var createdAt: LocalDateTime? = null


}