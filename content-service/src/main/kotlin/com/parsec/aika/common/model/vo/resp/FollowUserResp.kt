package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.Gender
import java.io.Serializable

class FollowUserResp : Serializable {

    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    var avatar: String? = null

    var username: String? = null

    var nickname: String? = null

    var bio: String? = null

    var gender: Gender? = null

    var followed: Boolean? = null

}