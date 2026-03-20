package com.parsec.aika.user.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.user.model.em.FollowMethod
import jakarta.validation.constraints.NotNull

/**
 * 改变用户状态
 */
class AppFollowOrCancelReq {

    /**
     * 操作： FOLLOW 关注， CANCEL 取消
     */
    var method: FollowMethod? = null


    /**
     * 当前用户id
     */
    var userId: Long? = null

    /**
     * 被关注or取消关注用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    @NotNull(message = "被关注or取消关注用户ID不能为空")
    var followingId: Long? = null
}
