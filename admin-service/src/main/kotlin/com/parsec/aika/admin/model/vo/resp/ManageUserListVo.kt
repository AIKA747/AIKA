package com.parsec.aika.admin.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

/**
 *
 *
 * @author yuanmr
 * @date 2024/1/16
 */
class ManageUserListVo {

    /**
     * 用户头像，用户头像
     */
    var avatar: String? = null

    /**
     * 创建时间，创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 用户id，用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 用户昵称，用户昵称
     */
    var nickname: String? = null

    /**
     * 角色id，角色id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var roleId: Long? = null

    /**
     * 角色名称，角色名称
     */
    var roleName: String? = null

    /**
     * 用户账户，用户账户
     */
    var username: String? = null

    /**
     * 用户状态，用户状态
     */
    var userStatus: String? = null

}