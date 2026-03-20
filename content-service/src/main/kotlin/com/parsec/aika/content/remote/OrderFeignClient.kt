package com.parsec.aika.content.remote

import com.parsec.aika.content.remote.fallback.OrderFeignFallback
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import java.time.LocalDateTime

@FeignClient(value = "aika-order-service", path = "/order", fallback = OrderFeignFallback::class)
interface OrderFeignClient {

    @GetMapping("/feign/user/subscription/expired-time")
    fun getFeignUserSubscriptionExpiredTime(
        @RequestParam("userId") userId: Long, @RequestParam("country") country: String? = null
    ): BaseResult<LocalDateTime?>
}