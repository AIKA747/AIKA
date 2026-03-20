package com.parsec.aika.common.model.vo

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.UserTypeEnum

class LoginUserInfo {

    var userId: Long? = null

    var username: String? = null

    var userType: UserTypeEnum? = null

    var status: UserStatus? = null

    var phone: String? = null

    var email: String? = null

    var country: String? = null

    /**
     * 性别：'MALE','HIDE','FEMALE'
     */
    var gender: Gender? = null

    var language: String? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null

    /**
     * 用户头像
     */
    var avatar: String? = null
}

enum class UserStatus {
    unverified, uncompleted, enabled, disabled
}