package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

@TableName("rules")
class Rules {

    /**
     * 策略id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 策略内容
     */
    var rule: String? = null

    /**
     * 状态：0禁用，1启用
     */
    var status: Boolean? = null

}