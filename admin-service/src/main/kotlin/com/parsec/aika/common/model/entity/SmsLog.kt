package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("`sms_log`")
class SmsLog {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 手机号
     */
    var phone: String? = null

    /**
     * 短信内容
     */
    var content: String? = null

    /**
     * 状态：0失败，1成功
     */
    var status: Boolean? = null

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