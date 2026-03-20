package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

data class MyGameVO(
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null,
    var gameId: Long? = null,
    var status: String? = null,
    var cover: String? = null,
    var resultSummary: String? = null,
    var gameName: String? = null,
    var createdAt: LocalDateTime? = null,
    var updatedAt: LocalDateTime? = null,
    var listCoverDark: String? = null,
    var introduce: String? = null
)
