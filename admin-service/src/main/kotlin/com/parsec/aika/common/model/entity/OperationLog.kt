package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

@TableName("`operation_log`")
class OperationLog {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 管理员id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var adminId: Long? = null

    /**
     * 管理员名称
     */
    var adminName: String? = null

    /**
     * 模块名称
     */
    var module: String? = null

    /**
     * 记录标识
     */
    var record: String? = null

    /**
     * 原始值
     */
    var initialValue: String? = null

    /**
     * 最终值
     */
    var finalValue: String? = null

    /**
     * 操作时间
     */
    var operatedTime: LocalDateTime? = null

    /**
     * 操作类型：post.put.delete
     */
    var action: String? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 更新时间
     */
    var updatedAt: LocalDateTime? = null

    /**
     * 数据版本，每更新一次+1
     */
    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null

    /**
     * 是否删除：0否，1是
     */
    @TableLogic(value = "0", delval = "1")
    var deleted: Boolean? = false

    var ip: String? = null

    var path: String? = null

}