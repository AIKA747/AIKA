package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.em.Gender

/**
 * 机器人推荐
 */
class BotRecommendBO {

    /**
     * 机器人id
     */
    var id: String? = null

    /**
     * 机器人名称
     */
    var botName: String? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 性别
     */
    var gender: Gender? = null

    /**
     * 介绍
     */
    var botIntroduce: String? = null
}