package com.parsec.aika.order.service

import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.entity.Payment
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.GetAppPaymentHistoryReq
import com.parsec.aika.order.model.vo.resp.GetAppPaymentHistoryResp
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.trantor.common.response.PageResult
import java.time.LocalDateTime

interface PaymentService {
    fun getAppPaymentHistory(
        req: GetAppPaymentHistoryReq, loginUserInfo: LoginUserInfo
    ): PageResult<GetAppPaymentHistoryResp>

    fun getAppPaymentResult(orderNo: String): GetAppPaymentResultResp
    fun savePaymentInfo(payment: Payment): Payment

    fun paySuccess(
        payNo: String,
        localDateTime: LocalDateTime,
        transactionId: String? = null,
        receipt: String? = null
    ): Payment

    fun payFailed(payNo: String, description: String)
    fun getAppPaymentTotalAmount(userId: Long?): Long?
    fun testPaySuccess(orderNo: String, user: LoginUserInfo): GetAppPaymentResultResp
    fun getPaymentInfo(payNo: String): Payment
    fun checkInAppPayReceipt(transactionId: String, receipt: String)

    /**
     * 0元支付
     */
    fun zeroPay(order: Order): Order
}