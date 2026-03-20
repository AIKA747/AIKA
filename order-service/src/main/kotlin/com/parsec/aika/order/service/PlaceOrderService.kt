package com.parsec.aika.order.service

import com.parsec.aika.common.model.entity.Order
import com.parsec.aika.common.model.vo.LoginUserInfo

interface PlaceOrderService {
    fun placeOrder(user: LoginUserInfo, packageId: Long?): Order?
}