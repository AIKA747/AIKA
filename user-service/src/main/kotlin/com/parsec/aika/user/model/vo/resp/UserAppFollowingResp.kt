package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.user.model.em.Gender
import com.parsec.aika.user.model.entity.Bot
import java.time.LocalDateTime

/**
 * 关注我的用户列表
 */
class UserAppFollowingResp : PageVo() {

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
     * 用户名
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
     * 粉丝数量
     */
    var followerTotal: Int? = null

    /**
     * 故事数量
     */
    var storyTotal: Int? = null

    /**
     * 机器人数量
     */
    var botTotal: Int? = null

    /**
     * 最后一次发布机器人时间
     */
    var lastReleaseBotAt: LocalDateTime? = null

    /**
     * 最后一次分享故事时间
     */
    var lastShareStoryAt: LocalDateTime? = null

    /**
     * 机器人列表
     */
    var bots: List<Bot>? = null

    var friend: Boolean? = null

}
