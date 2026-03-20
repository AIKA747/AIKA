package com.parsec.aika.order.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.resp.CreatePaymentIntentResp
import com.stripe.model.PaymentIntent

interface StripeService {
    fun createPaymentIntent(user: LoginUserInfo, orderNo: String?): CreatePaymentIntentResp?

    fun retrievePaymentIntent(id: String): PaymentIntent?

    fun stripeWebhook(stripeSignature: String, payload: String)
}