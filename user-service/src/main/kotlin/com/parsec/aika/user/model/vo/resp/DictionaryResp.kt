package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

class DictionaryResp {

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

}