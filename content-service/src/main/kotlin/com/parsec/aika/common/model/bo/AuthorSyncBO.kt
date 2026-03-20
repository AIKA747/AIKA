package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.UserStatus

class AuthorSyncBO {

    // 作者头像地址
    var avatar: String? = null

    // 显示的昵称
    var nickname: String? = null

    // @的用户名
    var username: String? = null

    // 用户的数字ID
    var userId: Long = 0

    // 类型（USER、BOT枚举，这里暂用字符串表示，可按需优化为枚举类型）
    var type: AuthorType? = null

    var bio: String? = null

    //性别：MALE, HIDE, FEMALE
    var gender: Gender? = null

    //用户状态
    var status: UserStatus? = null
}