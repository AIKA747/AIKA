package com.parsec.aika.admin.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

open class GetRolesResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var roleName: String? = null
    var createdAt: LocalDateTime? = null
}