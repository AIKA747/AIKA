package com.parsec.aika.order.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import java.time.LocalDateTime

class GetAppPaymentResultResp {
    /**
     * id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 支付方式
     */
    var payMethod: PayMethodEnum? = null

    /**
     * 金额（单位分）
     */
    var amount: Long? = null

    /**
     * 第三方支付订单号
     */
    var payNo: String? = null

    /**
     * 订单号
     */
    var orderNo: String? = null

    /**
     * 状态
     */
    var status: PayStatusEnum? = null

    /**
     * 退款单号
     */
    var refundNo: String? = null

    /**
     * 支付回调时间
     */
    var callbackTime: LocalDateTime? = null

    /**
     * 信用卡号
     */
    var creditCard: String? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null
}