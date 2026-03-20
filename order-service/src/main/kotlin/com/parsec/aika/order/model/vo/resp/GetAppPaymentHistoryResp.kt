package com.parsec.aika.order.model.vo.resp

import com.parsec.aika.common.aspect.Translate
import com.parsec.aika.common.model.em.PayMethodEnum
import java.time.LocalDateTime

@Translate(fields = ["packageName"])
class GetAppPaymentHistoryResp {
    /**
     * 支付方式
     */
    var payMethod: PayMethodEnum? = null

    /**
     * 金额（单位分）
     */
    var amount: Double? = null

    /**
     * 支付时间（由第三方支付平台返回）
     */
    var payTime: LocalDateTime? = null
    /**
     * 订阅过期时间
     */
    var expiredAt: LocalDateTime? = null

    /**
     * 退款单号，该字段不为空时表明是退款
     */
    var refundNo: String? = null

    /**
     * 订单号
     */
    var orderNo: String? = null

    var packageId: String? = null

    var packageName: String? = null
}