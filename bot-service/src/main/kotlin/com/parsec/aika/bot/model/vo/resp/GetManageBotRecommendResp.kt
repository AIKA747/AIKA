package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotSourceEnum
import java.time.LocalDateTime


class GetManageBotRecommendResp {

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * builtIn，userCreated
     */
    var botSource: BotSourceEnum? = null

    /**
     * 推荐排序
     */
    var sortNo: Int? = null

    /**
     * 推荐封面
     */
    var recommendImage: String? = null

    /**
     * 推荐时间
     */
    var recommendTime: LocalDateTime? = null

    /**
     * 推荐词
     */
    var recommendWords: String? = null


    /**
     * 是否推荐
     */
    var recommend: Boolean? = null

    var botName: String? = null

    /**
     * 评分
     */
    var rating: Double? = null

    var visibled: Boolean? = null
}