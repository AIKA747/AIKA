package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.user.model.em.Gender
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalDateTime

@Translate(["tags"])
class AppUserResp {
    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 用户名
     */
    var username: String? = null

    /**
     * 头像
     */
    var avatar: String? = null

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
     * 标签
     */
    var tags: List<String>? = null

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
     * (我分享的故事)评论数量
     */
    var commentTotal: Int? = null

    /**
     * 系统通知
     */
    var notifyFlag: Int? = null

    /**
     * 用户状态
     */
    var status: UserStatus? = null

    /**
     * 刷新token
     */
    var token: String? = null

    /**
     * 国家,ISO 3166-1国际标准代码
     */
    var country: String? = null

    /**
     * 语言,ISO 639-1国际标准代码
     */
    var language: String? = null

    /**
     * 是否已设置密码
     */
    var setPassword: Boolean? = null

    var loginType: LoginType? = null

    var firstLogin: Boolean? = null

    /**
     * 用户昵称
     */
    var nickname: String? = null


    /**
     * 生日
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    var birthday: LocalDate? = null

    var bio: String? = null

    var expiredDate: LocalDateTime? = null

    var allowJoinToChat: Boolean? = null

    /**
     * 背景图片
     */
    var backgroundImage: String? = null
}

enum class LoginType {
    email, google, apple, facebook
}
