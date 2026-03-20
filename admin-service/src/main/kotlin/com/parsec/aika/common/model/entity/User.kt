package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.trantor.mybatisplus.base.BaseDomain

@TableName("`user`")
class User: BaseDomain() {

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
     * 密码
     */
    var password: String? = null

    /**
     * 角色id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var roleId: Long? = null

    /**
     * 用户状态
     */
    var userStatus: UserStatus? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    /**
     * 更新人
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var updater: Long? = null

}