package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import javax.validation.constraints.NotNull


class PostAppRateReq {
    @NotNull
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null
    @NotNull
    var rating: Double? = null
    var content: String? = null
}