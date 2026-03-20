package com.parsec.aika.order.controller

import cn.hutool.core.lang.Assert
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.CreatePaymentIntentReq
import com.parsec.aika.order.model.vo.resp.GetAppPaymentResultResp
import com.parsec.aika.order.service.PaymentService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Value
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class TestController {

    @Resource
    private lateinit var paymentService: PaymentService

    @Value("\${NACOS_NS:}")
    private lateinit var ns: String

    @GetMapping("/test")
    fun test(param: String): String {
        StaticLog.info("test:$param")
        return "order:$param"
    }

    /**
     * 调用该接口的订单直接支付成功，并生成支付信息
     */
    @PostMapping("/app/payment")
    fun appPayment(
        user: LoginUserInfo, @Validated @RequestBody req: CreatePaymentIntentReq
    ): BaseResult<GetAppPaymentResultResp> {
        Assert.state(ns != "prod", "仅测试环境才允许调用")
        return BaseResult.success(paymentService.testPaySuccess(req.orderNo!!, user))
    }

    @GetMapping("/public/health")
    fun health(): BaseResult<*> {
        return BaseResult.success()
    }

}