package com.parsec.aika.user.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import jakarta.validation.constraints.NotNull


class PutManageGroupReq {

    /**
     * name
     */
    @NotNull(message = "用户组名称不能为空")
    var groupName: String? = null

    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    @NotNull(message = "用户组id不能为空")
    var groupId: Long? = null
}