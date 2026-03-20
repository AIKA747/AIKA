package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import javax.validation.constraints.NotNull

/**
 * @author RainLin
 * @since 2024/1/29 15:15
 */
class PostManageBotDigitalHumanIdleAnimationReq {
    @NotNull
    var driverUrl: String? = null

    /**
     *  数字人配置id
     */
    @NotNull
    @JsonSerialize(using = ToStringSerializer::class)
    var profileId: Long? = null
}