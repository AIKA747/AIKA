package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.Gender
import com.parsec.trantor.mybatisplus.base.BaseDomain

@TableName("user_assistant")
class UserAssistant : BaseDomain() {

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null


    /**
     * 助手id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var assistantId: Long? = null

    /**
     * 助手性别
     */
    var gender: Gender? = null

}