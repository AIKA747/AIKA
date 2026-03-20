package com.parsec.aika.common.model.vo

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.user.model.em.Gender

class AppUserVO {

    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    var username: String? = null

    var nickname: String? = null

    var avatar: String? = null

    var status: UserStatus? = null

    var phone: String? = null

    var email: String? = null

    var country: String? = null

    var language: String? = null

    var allowJoinToChat: Boolean? = null

    var gender: Gender? = null

    var distance: Double? = null

    var bio: String? = null

}
