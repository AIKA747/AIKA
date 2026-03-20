package com.parsec.aika.order.controller.app

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.OrderServiceApplicationTests
import com.parsec.aika.order.model.vo.req.CreatePaymentIntentReq
import com.parsec.aika.order.service.StripeService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional

class StripeControllerTest : OrderServiceApplicationTests() {

    @Autowired
    private lateinit var stripeController: StripeController

    @Autowired
    private lateinit var stripeService: StripeService

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/service_package_init.sql")
    fun createPaymentIntent() {
        val createPaymentIntent = stripeController.createPaymentIntent(LoginUserInfo().apply {
            userId = 102
            userType = UserTypeEnum.APPUSER
            username = "test"
            email = "1236@163.com"
            country = "CN"
        }, CreatePaymentIntentReq().apply { orderNo = "321323453451322" })
        StaticLog.info("createPaymentIntent:{}", JSONUtil.toJsonStr(createPaymentIntent))
    }

    @Test
    fun retrievePaymentIntent() {
        //pi_3OZ7bXC7pptL4PA808W8LXUA
        //pi_3OZ7bXC7pptL4PA808W8LXUA_secret_clByUQwEfiqxsrvf9aFM4FjAQ
        val paymentIntent = stripeService.retrievePaymentIntent("pi_3OZ7bXC7pptL4PA808W8LXUA")
        StaticLog.info("paymentIntent:{}", JSONUtil.toJsonStr(paymentIntent))
    }

}