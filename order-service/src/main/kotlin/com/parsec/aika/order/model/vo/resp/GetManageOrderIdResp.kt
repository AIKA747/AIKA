package com.parsec.aika.order.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import java.time.LocalDateTime

class GetManageOrderIdResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var orderNo: String? = null
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null
    var username: String? = null
    var phone: String? = null
    var email: String? = null
    var amount: Long? = null
    @JsonSerialize(using = ToStringSerializer::class)
    var packageId: Long? = null
    var packageName: String? = null
    var status: OrderStatusEnum? = null
    var callbackAt: LocalDateTime? = null
    var cancelAt: LocalDateTime? = null
    var createdAt: LocalDateTime? = null
    var updatedAt: LocalDateTime? = null
    var paymentInfo: List<GetManageOrderIdPaymentInfoResp>? = null
}