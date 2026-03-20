package com.parsec.aika.admin.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

open class PostRoleReq {
    @NotNull
    var roleName: String? = null

    @NotEmpty
    @JsonSerialize(using = ToStringSerializer::class)
    var resourceIds: List<Long?>? = null

    var remark: String? = null
}