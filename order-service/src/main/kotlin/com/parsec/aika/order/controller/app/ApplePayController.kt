package com.parsec.aika.order.controller.app

import cn.hutool.log.StaticLog
import com.parsec.aika.order.model.vo.req.CheckApplePayReq
import com.parsec.aika.order.model.vo.req.CreatePaymentIntentReq
import com.parsec.aika.order.model.vo.resp.PaymentResp
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.aika.order.service.ApplePayService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class ApplePayController {

    @Autowired
    private lateinit var applePayService: ApplePayService

    @PostMapping("/app/in-app-purchase")
    fun createApplePay(@Validated @RequestBody req: CreatePaymentIntentReq): BaseResult<PaymentResp> {
        return BaseResult.success(applePayService.createApplePay(req.orderNo))
    }

    @PostMapping("/app/in-app-purchase/check")
    fun applePayCheck(@Validated @RequestBody req: CheckApplePayReq): BaseResult<GetAppPaymentResultResp> {
        return BaseResult.success(applePayService.check(req.test, req.receipt!!, req.payNo!!, req.transactionId!!))
    }

    @PostMapping("/app/in-app-purchase/check/v2")
    fun applePayCheckV2(@Validated @RequestBody req: CheckApplePayReq): BaseResult<GetAppPaymentResultResp> {
        return BaseResult.success(applePayService.checkV2(req.test, req.receipt!!, req.payNo!!, req.transactionId!!))
    }

    @PostMapping("/public/apple/notify")
    fun appleServerNotify(@RequestBody body: String): BaseResult<Void> {
        StaticLog.info("appleServerNotify:{}", body)
        applePayService.saveServerNotify(body)
        return BaseResult.success()
    }

}