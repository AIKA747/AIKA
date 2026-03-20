package com.parsec.aika.admin.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

class ManageUserDetailVo {

    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 昵称
     */
    var nickname: String? = null

    /**
     * 账户
     */
    var username: String? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 角色id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var roleId: Long? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

}