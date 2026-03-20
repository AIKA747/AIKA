package com.parsec.aika.order.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import java.time.LocalDateTime

class GetManageOrdersResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var orderNo: String? = null
    var username: String? = null
    var amount: Double? = null
    var status: OrderStatusEnum? = null
    var createdAt: LocalDateTime? = null
}