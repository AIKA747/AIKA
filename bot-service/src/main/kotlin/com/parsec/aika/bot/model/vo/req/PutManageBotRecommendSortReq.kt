package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import javax.validation.constraints.NotNull


class PutManageBotRecommendSortReq {

    /**
     * 排序
     */
    @NotNull
    var sortNo: Int? = null

    /**
     * 机器人id
     */
    @NotNull
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null

}
