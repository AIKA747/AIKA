package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.user.model.em.Gender

class AppUserInfoResp {
    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 昵称
     */
    var username: String? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 性别：0隐藏，1男，2女
     */
    var gender: Gender? = null

    /**
     * 我的机器人数量
     */
    var botTotal: Int? = null

    /**
     * 我的故事数量
     */
    var storyTotal: Int? = null

    /**
     * 我的粉丝数量
     */
    var followerTotal: Int? = null

    /**
     * 当前用户是否已关注查询的这个用户
     */
    var followed: Boolean? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null

    /**
     * 简介
     */
    var bio: String? = null

    /**
     * 是否为朋友
     */
    var friend: Boolean? = null

    var backgroundImage: String? = null

    var isBlacked: Boolean? = null

    var status: UserStatus? = null
}