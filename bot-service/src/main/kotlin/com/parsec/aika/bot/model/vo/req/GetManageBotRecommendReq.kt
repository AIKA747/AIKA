package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotSourceEnum
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.vo.PageVo


class GetManageBotRecommendReq : PageVo() {
    // 机器人名称
    var botName: String? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var categoryId: Long? = null

    var botSource: BotSourceEnum? = null

    var minRecommendTime: String? = null
    var maxRecommendTime: String? = null
    var from: String? = null
    var to: String? = null
    var botStatus: BotStatusEnum? = null

}