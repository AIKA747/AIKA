package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer


class GetAppRulesResp  {
    /**
     * 策略id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 策略内容
     */
    var rule: String? = null
}