package com.parsec.aika.order.controller.app

import com.parsec.aika.order.model.vo.req.CheckGooglePayReq
import com.parsec.aika.order.model.vo.req.CreatePaymentIntentReq
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.aika.order.model.vo.resp.PaymentResp
import com.parsec.aika.order.service.GooglePayService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class GooglePayController {
    @Autowired
    private lateinit var googlePayService: GooglePayService

    /**
     * 发起google支付订单
     */
    @PostMapping("/app/google/in-app-purchase")
    fun createGooglePay(@Validated @RequestBody req: CreatePaymentIntentReq): BaseResult<PaymentResp> {
        return BaseResult.success(googlePayService.createGooglePay(req.orderNo))
    }

    /**
     * google内购订单校验
     */
    @PostMapping("/app/google/in-app-purchase/check")
    fun check(@Validated @RequestBody req: CheckGooglePayReq): BaseResult<GetAppPaymentResultResp> {
        return BaseResult.success(googlePayService.check(req))
    }

}