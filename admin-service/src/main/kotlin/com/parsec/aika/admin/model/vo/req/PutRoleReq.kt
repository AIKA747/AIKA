package com.parsec.aika.admin.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import javax.validation.constraints.NotNull

class PutRoleReq: PostRoleReq() {
    @NotNull
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
}