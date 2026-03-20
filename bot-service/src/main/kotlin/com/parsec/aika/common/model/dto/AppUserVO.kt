package com.parsec.aika.common.model.dto

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.vo.UserStatus

/**
 * @author husu
 * @version 1.0
 * @date 2025/2/26.
 */
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
