package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

class CategoryVo {

    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    var name: String? = null

    var weight: Int? = null

}
