package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.user.model.em.Gender
import java.time.LocalDateTime

class ManagerUserResp {
    /**
     * 头像链接
     */
    var avatar: String? = null

    /**
     * 简介
     */
    var bio: String? = null

    /**
     * 我的机器人数量
     */
    var botTotal: Int? = null

    /**
     * 国家
     */
    var country: String? = null

    /**
     * 邮箱
     */
    var email: String? = null

    /**
     * 我的粉丝数量
     */
    var followerTotal: Int? = null

    /**
     * 性别：0隐藏，1男，2女
     */
    var gender: Gender? = null

    /**
     * 用户分组集合
     */
    var group: List<Group>? = null

    var packages: List<Package>? = null

    /**
     * 手机号
     */
    var phone: String? = null

    /**
     * 状态；0.enabled，1.disabled
     */
    var status: UserStatus? = null

    /**
     * 我的故事数量
     */
    var storyTotal: Int? = null

    /**
     * 订阅机器人数量
     */
    var subBotTotal: Int? = null

    /**
     * 标签(Interest)
     */
    var tags: List<String>? = null

    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 用户昵称/姓名
     */
    var username: String? = null
}


class Group {
    /**
     * 分组id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 分组名称
     */
    var groupName: String? = null
}

class Package {
    /**
     * 过期时间
     */
    var expiredDate: LocalDateTime? = null

    /**
     * 服务包id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 服务包
     */
    var packageName: String? = null

    /**
     * 订阅时间
     */
    var subscriptTime: LocalDateTime? = null
}