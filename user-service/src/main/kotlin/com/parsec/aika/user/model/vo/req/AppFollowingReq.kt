package com.parsec.aika.user.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import jakarta.validation.constraints.NotNull

/**
 * 改变用户状态
 */
class AppFollowingReq {

    /**
     * 用户id
     */
    var userId: Long? = null

    /**
     * 被关注用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    @NotNull(message = "被关注用户ID不能为空")
    var followingId: Long? = null
}