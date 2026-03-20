package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

open class GetPushListsResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var title: String? = null
    var content: String? = null
    var pushTo: String? = null
    var soundAlert: Boolean? = null
    var operator: String? = null
    var received: Int? = null
    var pushTotal: Int? = null
    var pushTime: LocalDateTime? = null
    var createdAt: LocalDateTime? = null
}