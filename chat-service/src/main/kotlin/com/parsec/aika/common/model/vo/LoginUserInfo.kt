package com.parsec.aika.common.model.vo

import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.em.UserTypeEnum


class LoginUserInfo {

    var userId: Long? = null

    var username: String? = null

    var avatar: String? = null

    var userType: UserTypeEnum? = null

    var status: UserStatus? = null

    var phone: String? = null

    var email: String? = null

    var country: String? = null

    var language: String? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null
}