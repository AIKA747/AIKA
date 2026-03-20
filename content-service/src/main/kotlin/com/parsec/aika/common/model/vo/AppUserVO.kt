package com.parsec.aika.common.model.vo

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.UserStatus

class AppUserVO {

    var id: Long? = null

    var username: String? = null

    var nickname: String? = null

    /**
     * 用户头像
     */
    var avatar: String? = null

    var status: UserStatus? = null

    var phone: String? = null

    var email: String? = null

    var country: String? = null

    var language: String? = null

    var allowJoinToChat: Boolean? = null

    var gender: Gender? = null
}
