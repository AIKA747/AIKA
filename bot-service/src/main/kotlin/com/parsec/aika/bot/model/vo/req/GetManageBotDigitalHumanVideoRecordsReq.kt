package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.vo.PageVo
import javax.validation.constraints.NotNull

/**
 * @author RainLin
 * @since 2024/1/29 11:49
 */
class GetManageBotDigitalHumanVideoRecordsReq : PageVo() {
    @NotNull
    @JsonSerialize(using = ToStringSerializer::class)
    var profileId: Long? = null
}