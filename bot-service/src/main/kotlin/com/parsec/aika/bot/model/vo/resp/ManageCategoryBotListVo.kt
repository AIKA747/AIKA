package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotSourceEnum

class ManageCategoryBotListVo {

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null

    /**
     * 机器人名称
     */
    var botName: String? = null

    /**
     * 机器人是否是数字人
     * 判断机器人中的模型字段（supportedModels）是否包含DigitaHumanService
     */
    var digitalHuman: Boolean? = false

    /**
     * 机器人来源
     */
    var botSource: BotSourceEnum? = null

    /**
     * 机器人栏目id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var categoryId: Long? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    var creatorName: String? = null
}