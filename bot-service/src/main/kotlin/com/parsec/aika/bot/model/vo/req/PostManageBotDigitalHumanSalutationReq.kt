package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import javax.validation.constraints.NotNull

/**
 * @author RainLin
 * @since 2024/1/29 15:15
 */
class PostManageBotDigitalHumanSalutationReq {
    @NotNull
    var audioUrl: String? = null

    /**
     *  数字人配置id
     */
    @NotNull
    @JsonSerialize(using = ToStringSerializer::class)
    var profileId: Long? = null

    var language: String? = null

    var voiceName: String? = null

    var content: String? = null
}