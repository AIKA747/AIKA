package com.parsec.aika.user.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.UserStatus
import jakarta.validation.constraints.NotNull

/**
 * 改变用户状态
 */
class ManageUserStatusReq {

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    @NotNull(message = "用户ID不能为空")
    var userId: Long? = null

    /**
     * 用户状态
     */
    @NotNull(message = "用户状态不能为空")
    var status: UserStatus? = null
}