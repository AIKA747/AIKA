package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.entity.BaseDomain
import com.parsec.aika.user.model.em.Gender
import java.time.LocalDate
import java.time.LocalDateTime


@TableName("user", autoResultMap = true)
class AppUserInfo : BaseDomain() {

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
     * 手机号
     */
    var phone: String? = null

    /**
     * 邮箱
     */
//    @FieldEncrypt
    var email: String? = null

    /**
     * 登录密码
     */
    var password: String? = null

    /**
     * 状态：unverified，uncompleted，enabled，disabled
     */
    var status: UserStatus? = null

    /**
     * 性别：'MALE','HIDE','FEMALE'
     */
    var gender: Gender? = null

    /**
     * 简介
     */
    var bio: String? = null

    /**
     * 标签
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var tags: List<String>? = null

    /**
     * 国家,ISO 3166-1国际标准代码
     */
    var country: String? = null

    /**
     * 语言,ISO 639-1国际标准代码
     */
    var language: String? = null

    /**
     * 国/州/市/区
     */
    var countryCode: String? = null

    /**
     * 生日
     */
    var birthday: LocalDate? = null

    /**
     * 我的机器人数量
     */
    var botTotal: Int? = null

    /**
     * 订阅机器人数量
     */
    var subBotTotal: Int? = null

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
     * 系统通知1：0x001；关注用户创建机器人通知2：0x010；被订阅点赞关注通知4：0x100
     */
    var notifyFlag: Int? = null

    /**
     * 最后一次登录时间
     */
    var lastLoginAt: LocalDateTime? = null

    /**
     * 最后一次发布机器人时间
     */
    var lastReleaseBotAt: LocalDateTime? = null

    /**
     * 最后一次分享故事时间
     */
    var lastShareStoryAt: LocalDateTime? = null

    /**
     * 最后一次活动时间
     */
    var lastActivedAt: LocalDateTime? = null

    /**
     * 机器人
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var bots: List<Bot>? = null

    /**
     * 邮箱注册验证时间
     */
    var registerTime: LocalDateTime? = null

    /**
     * 创建人
     */
    var creator: String? = null

    /**
     * 更新人
     */
    var updater: String? = null

    /**
     * 注册平台类型
     */
    var registerType: PlatformType? = null

    /**
     * google登录，获取到的用户信息
     */
    var googlePayload: String? = null

    /**
     * apple登录，获取到的用户信息
     */
    var applePayload: String? = null

    /**
     * facebook登录，获取到的用户信息
     */
    var facebookPayload: String? = null

    /**
     * 运动兴趣向量，比如 {"12":1,"13":0,"14":1}
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var sport: Map<String, Int>? = null

    /**
     * 娱乐兴趣向量，比如 {"12":1,"13":0,"14":1}
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var entertainment: Map<String, Int>? = null

    /**
     * 新闻类兴趣向量 比如 {"12":1,"13":0,"14":1}
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var news: Map<String, Int>? = null

    /**
     * 游戏兴趣向量 比如 {"12":1,"13":0,"14":1}
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var gaming: Map<String, Int>? = null

    /**
     * 艺术类兴趣向量
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var artistic: Map<String, Int>? = null

    /**
     * 生活方式类兴趣向量
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var lifestyle: Map<String, Int>? = null

    /**
     * 技术与发明类兴趣向量
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var technology: Map<String, Int>? = null

    /**
     * 社交兴趣向量
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var social: Map<String, Int>? = null


    var curLat: Double? = null

    var curLng: Double? = null

    /**
     * The Gender of interest
     */
    var interestGender: Gender? = null

    /**
     * A switch to decide whether to show the gender
     */
    var showGender: Boolean? = null

    /**
     * 职业
     */
    var occupation: String? = null

    /**
     * 是否允许加入群聊
     */
    var allowJoinToChat: Boolean? = null

    /**
     * 背景图片
     */
    var backgroundImage: String? = null

}
