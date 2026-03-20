package com.parsec.aika.order.controller.app

import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.GetAppPaymentHistoryReq
import com.parsec.aika.order.model.vo.resp.GetAppPaymentHistoryResp
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.aika.order.service.PaymentService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppPaymentController {

    @Resource
    private lateinit var paymentService: PaymentService

    /**
     * 支付历史记录
     */
    @TranslateResult
    @GetMapping("/app/payment/history")
    fun getAppPaymentHistory(
        req: GetAppPaymentHistoryReq, loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<GetAppPaymentHistoryResp>> {
        return BaseResult.success(paymentService.getAppPaymentHistory(req, loginUserInfo))
    }

    /**
     * 支付结果查询
     */
    @GetMapping("/app/payment/result")
    fun getAppPaymentResult(orderNo: String, loginUserInfo: LoginUserInfo): BaseResult<GetAppPaymentResultResp> {
        return BaseResult.success(paymentService.getAppPaymentResult(orderNo))
    }

    /**
     * 查询支付总金额
     */
    @GetMapping("/app/payment/total-amount")
    fun getAppPaymentTotalAmount(loginUserInfo: LoginUserInfo): BaseResult<Long> {
        return BaseResult.success(paymentService.getAppPaymentTotalAmount(loginUserInfo.userId))
    }
}