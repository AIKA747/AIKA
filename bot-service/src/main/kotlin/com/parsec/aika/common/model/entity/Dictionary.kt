package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate

@Translate(fields = ["dicLab"])
@TableName("dictionary")
class Dictionary {

    /**
     * 主键id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 字典类型
     */
    var dicType: String? = null

    /**
     * 字典值
     */
    var dicValue: String? = null

    /**
     * 排序
     */
    var sortNo: Int? = null

    /**
     * 字典国际化显示标签
     */
    @TableField(exist = false)
    var dicLab: String? = null

}