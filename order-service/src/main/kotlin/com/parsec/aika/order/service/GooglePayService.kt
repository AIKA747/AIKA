package com.parsec.aika.order.service

import com.parsec.aika.order.model.vo.req.CheckGooglePayReq
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.aika.order.model.vo.resp.PaymentResp

interface GooglePayService {
    fun createGooglePay(orderNo: String?): PaymentResp?
    fun check(req: CheckGooglePayReq): GetAppPaymentResultResp?
}