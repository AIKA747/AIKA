package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.vo.PageVo


class GetAppRateReq: PageVo() {
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null
}