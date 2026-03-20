package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.io.Serializable
import java.time.LocalDateTime

class BlockedAuthorResp : Serializable {

    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    var avatar: String? = null

    var nickname: String? = null

    var username: String? = null

    var createdAt: LocalDateTime? = null

    var bio: String? = null

    var caseCleanAt: LocalDateTime? = null

    var flagNum: Int? = null
}