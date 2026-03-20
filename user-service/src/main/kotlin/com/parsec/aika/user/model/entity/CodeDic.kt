package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

@TableName("code_dic")
class CodeDic {

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     *编码类型
     */
    @TableField("`type`")
    var type: CodeType? = null

    @TableField("`code`")
    var code: String? = null

    @TableField("`detail`")
    var detail: String? = null
}

enum class CodeType {
    country, language
}