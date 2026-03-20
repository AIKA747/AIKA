package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.vo.PageVo


class GetAppMyBotsReq: PageVo() {
    // 机器人名称
    var botName: String? = null
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null
}