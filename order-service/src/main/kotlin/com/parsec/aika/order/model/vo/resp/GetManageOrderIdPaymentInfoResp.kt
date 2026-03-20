package com.parsec.aika.order.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import com.parsec.aika.common.model.em.PayTypeEnum
import java.time.LocalDateTime

class GetManageOrderIdPaymentInfoResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var payMethod: PayMethodEnum? = null
    var amount: Long? = null
    var payNo: String? = null
    var status: PayStatusEnum? = null
    var refundNo: String? = null
    var payTime: LocalDateTime? = null
    var callbackTime: LocalDateTime? = null
    var creditCard: String? = null
    var type: PayTypeEnum? = null
    var reason: String? = null

}