package com.parsec.aika.order.controller.app

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.OrderServiceApplicationTests
import com.parsec.aika.order.model.vo.req.PlaceOrderReq
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional

class AppPlaceOrderControllerTest : OrderServiceApplicationTests() {

    @Autowired
    private lateinit var appPlaceOrderController: AppPlaceOrderController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/service_package_init.sql")
    fun placeOrder() {
        val placeOrder = appPlaceOrderController.placeOrder(LoginUserInfo().apply {
            userId = 1
            userType = UserTypeEnum.APPUSER
            username = "test"
            email = "123@qq.com"
            country = "CN"
        }, PlaceOrderReq().apply { packageId = 10000001 })
        StaticLog.info("placeOrder:{}", JSONUtil.toJsonStr(placeOrder))
        Assert.notNull(placeOrder)
    }


}