package com.parsec.aika.user.model.vo.req

import com.parsec.aika.user.model.em.Gender

/**
 * 编辑用户信息
 */
class EditUserInfoReq {

    /**
     * 昵称，昵称
     */
    var username: String? = null

    /**
     * 头像，头像
     */
    var avatar: String? = null

    /**
     * 性别，性别：'MALE','HIDE','FEMALE'
     */
    var gender: Gender? = null

    /**
     * 通知设置，系统通知1：0x001；关注用户创建机器人通知2：0x010；被订阅收藏关注4：0x100
     */
    var notifyFlag: Int? = null

    /**
     * 标签，多个标签使用逗号分隔
     */
    var tags: List<String>? = null

    /**
     * 国家
     */
    var country: String? = null

    /**
     * 语言
     */
    var language: String? = null

    /**
     * 运动兴趣向量，比如 {"12":1,"13":0,"14":1}
     */
    var sport: Map<String, Int>? = null

    /**
     * 娱乐兴趣向量，比如 {"12":1,"13":0,"14":1}
     */
    var entertainment: Map<String, Int>? = null

    /**
     * 新闻类兴趣向量 比如 {"12":1,"13":0,"14":1}
     */
    var news: Map<String, Int>? = null

    /**
     * 游戏兴趣向量 比如 {"12":1,"13":0,"14":1}
     */
    var gaming: Map<String, Int>? = null

    /**
     * 艺术类兴趣向量
     */
    var artistic: Map<String, Int>? = null

    /**
     * 生活方式类兴趣向量
     */
    var lifestyle: Map<String, Int>? = null

    /**
     * 技术与发明类兴趣向量
     */
    var technology: Map<String, Int>? = null

    /**
     * 社交兴趣向量
     */
    var social: Map<String, Int>? = null


    /**
     * 生日
     */
    var birthday: String? = null

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


    var nickname: String? = null

    var bio: String? = null

    var allowJoinToChat: Boolean? = null

    /**
     * 背景图片
     */
    var backgroundImage: String? = null

}
