package com.parsec.aika.user.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import jakarta.validation.constraints.NotNull


/**
 * 标记关注用户最新更新已读
 */
class UserAppFollowerLastReadTimeReq {

    /**
     * followingId
     */
    @JsonSerialize(using = ToStringSerializer::class)
    @NotNull(message = "关注用户ID不能为空")
    var followingId: Long? = null

}