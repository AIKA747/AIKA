package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.user.model.em.Gender
import java.time.LocalDateTime

/**
 * 关注我的用户列表
 */
class UserAppFollowerResp {

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 最后一次读取时间
     */
    var lastReadTime: LocalDateTime? = null

    /**
     * 用户名
     */
    var username: String? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 是否互为好友
     */
    var friend: Boolean? = null

}