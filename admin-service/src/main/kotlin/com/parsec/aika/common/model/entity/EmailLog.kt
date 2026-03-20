package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("`email_log`")
class EmailLog {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 邮箱地址
     */
    var email: String? = null

    /**
     * 主题
     */
    var subject: String? = null

    /**
     * 邮件内容
     */
    var content: String? = null

    /**
     * 状态：success,fail
     */
    var status: String? = null

    /**
     * 发送时间
     */
    var sendTime: LocalDateTime? = null

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
    var deleted: Boolean? = null

}