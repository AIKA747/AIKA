package com.parsec.aika.order.controller.app

import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.CreatePaymentIntentReq
import com.parsec.aika.order.model.vo.resp.CreatePaymentIntentResp
import com.parsec.aika.order.service.StripeService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpServletResponse

@RestController
class StripeController {

    @Autowired
    private val stripeService: StripeService? = null


    @PostMapping("/app/payment/stripe/create-payment-intent")
    fun createPaymentIntent(
        user: LoginUserInfo, @RequestBody req: CreatePaymentIntentReq
    ): BaseResult<CreatePaymentIntentResp> {
        return BaseResult.success(stripeService!!.createPaymentIntent(user, req.orderNo))
    }


    @PostMapping("/public/payment/stripe/webhook")
    fun stripeWebhook(
        @RequestHeader("Stripe-Signature") stripeSignature: String,
        @RequestBody payload: String,
        response: HttpServletResponse
    ): String {
        try {
            stripeService!!.stripeWebhook(stripeSignature, payload)
            response.status = 200
        } catch (e: Exception) {
            StaticLog.error(e)
            response.status = 400
        }
        return ""
    }


}