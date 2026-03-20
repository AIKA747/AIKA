package com.parsec.aika.common.model.vo.resp

class AppThumbListResp {


    var id: Int? = null

    /**
     * 用户id
     */
    var userId: String? = null

    /**
     * 点赞用户头像
     */
    var avatar: String? = null

    /**
     * 昵称
     */
    var nickname: String? = null

    /**
     * 用户名
     */
    var username: String? = null

    /**
     * 点赞时间
     */
    var createdAt: String? = null

    /**
     * 是否关注
     */
    var followed: Boolean? = null
}