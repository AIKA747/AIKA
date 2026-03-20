package com.parsec.aika.user.model.entity

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer


class AppFriendInfo {

    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 用户昵称/姓名
     */
    var username: String? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null

    /**
     * 用户头像
     */
    var avatar: String? = null

    /**
     * 关注状态：我关注他(FOLLOWING)；他关注我(FOLLOWED_BY) ;互相关注（MUTUAL)
     */
    var followStatus: String? = null

    /**
     * 简介
     */
    var bio: String? = null

    var friend: Boolean? = null


}
