package com.parsec.aika.order.service

import com.parsec.aika.order.model.vo.resp.PaymentResp
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp

interface ApplePayService {
    fun createApplePay(orderNo: String?): PaymentResp?

    fun check(test: Boolean?, receipt: String, payNo: String, transactionId: String): GetAppPaymentResultResp?

    fun saveServerNotify(body: String)

    fun checkV2(test: Boolean?, receipt: String, payNo: String, transactionId: String): GetAppPaymentResultResp?

}
