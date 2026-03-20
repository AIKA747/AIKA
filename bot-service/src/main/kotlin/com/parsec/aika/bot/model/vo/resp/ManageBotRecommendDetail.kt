package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

class ManageBotRecommendDetail {

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 机器人介绍
     */
    var botIntroduce: String? = null

    /**
     * 机器人名称
     */
    var botName: String? = null

    /**
     * 聊天数（机器人与用户聊天的信息总条数）
     */
    var chatTotal: Int? = null

    /**
     * 对话数（机器人与几个用户对话）
     */
    var dialogues: Int? = null

    /**
     * 评分
     */
    var rating: Double? = null

    /**
     * 推荐封面
     */
    var recommendImage: String? = null

    /**
     * 推荐词
     */
    var recommendWords: String? = null

    /**
     * 推荐排序
     */
    var sortNo: Int? = null

    /**
     * 订阅数量
     */
    var subscriberTotal: Int? = null

    var visibled: Boolean? = null

}