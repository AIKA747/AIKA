package com.parsec.aika.admin.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

class AdminUserResp {

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
     * 角色名称
     */
    var roleName: String? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

}