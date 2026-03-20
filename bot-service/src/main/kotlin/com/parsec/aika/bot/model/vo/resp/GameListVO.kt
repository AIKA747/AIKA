package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate

@Translate(fields = ["gameName", "listDesc"])
data class GameListVO(
    @JsonSerialize(using = ToStringSerializer::class) var id: Long? = null,
    var gameName: String? = null,
    var introduce: String? = null,
    var description: String? = null,
    var cover: String? = null,
    var listCover: String? = null,
    var avatar: String? = null,
    var listDesc: String? = null,
    var enable: Boolean? = null,
    var listCoverDark: String? = null

)
