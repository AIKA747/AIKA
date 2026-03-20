package com.parsec.aika.order.controller.app

import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.PlaceOrderReq
import com.parsec.aika.order.service.PlaceOrderService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AppPlaceOrderController {

    @Autowired
    private lateinit var placeOrderService: PlaceOrderService


    @PostMapping("/app/place-order")
    fun placeOrder(user: LoginUserInfo, @RequestBody order: PlaceOrderReq): BaseResult<Order> {
        // 实现逻辑
        return BaseResult.success(placeOrderService.placeOrder(user, order.packageId))
    }


}