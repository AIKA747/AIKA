package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

@TableName("role_profession")
class RoleProfession {

    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    var profession: String? = null

}