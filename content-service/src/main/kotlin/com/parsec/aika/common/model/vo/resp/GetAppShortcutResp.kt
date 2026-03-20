package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

data class GetAppShortcutResp(
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null,
    var nickname: String? = null,
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null,
    var type: String? = null,
    var avatar: String? = null,
    var postId: Int? = null
)
