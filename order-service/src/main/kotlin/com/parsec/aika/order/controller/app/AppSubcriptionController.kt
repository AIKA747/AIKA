package com.parsec.aika.order.controller.app

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.service.OrderService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
class AppSubcriptionController {

    @Autowired
    private lateinit var orderService: OrderService

    /**
     * 用户订阅过期时间
     */
    @GetMapping("/app/subscription/expired-time")
    fun getFeignUserSubscriptionExpiredTime(loginUserInfo: LoginUserInfo): BaseResult<LocalDateTime?> {
        val feignUserSubscription = orderService.getFeignUserSubscription(loginUserInfo.userId!!)
        return if (feignUserSubscription.isNotEmpty()) BaseResult.success(feignUserSubscription.last().expiredDate)
        else BaseResult.success(null)
    }


}