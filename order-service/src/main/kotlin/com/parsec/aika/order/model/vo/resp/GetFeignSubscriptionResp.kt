package com.parsec.aika.order.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

class GetFeignSubscriptionResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var packageId: Long? = null
    var packageName: String? = null
    var expiredDate: LocalDateTime? = null
    var cover: String? = null
    var description: String? = null
    var subscriptTime: LocalDateTime? = null

}