package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotStatusEnum
import javax.validation.constraints.NotNull


class PutManageBotStatusReq {

    /**
     * 状态
     */
    @NotNull
    var botStatus: BotStatusEnum? = null

    /**
     * 机器人id
     */
    @NotNull
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null

}
