package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.user.model.em.Gender
import java.time.LocalDateTime

class ManagerUserListResp {

    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 用户昵称/姓名
     */
    var username: String? = null

    /**
     * 手机号
     */
    var phone: String? = null

    /**
     * 邮箱
     */
    var email: String? = null

    /**
     * 性别：0隐藏，1男，2女
     */
    var gender: Gender? = null

    /**
     * 状态；0.enabled，1.disabled
     */
    var status: UserStatus? = null

    var createdAt: LocalDateTime? = null

    var nickname: String? = null

    var avatar: String? = null
}

