package com.parsec.aika.order.model.vo.resp

class CreatePaymentIntentResp(
    val clientSecret: String,
    val customerId: String,
    val ephemeralKey: String,
    val publishableKey: String,
)