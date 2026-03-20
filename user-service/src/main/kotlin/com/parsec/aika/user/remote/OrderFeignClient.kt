package com.parsec.aika.user.remote

import com.parsec.aika.common.model.dto.SubscriptionList
import com.parsec.aika.common.model.dto.UserSubscription
import com.parsec.aika.user.model.vo.req.ManageSubscriptionsQueryReq
import com.parsec.aika.user.remote.fallback.OrderFeignFallback
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import java.time.LocalDateTime

@FeignClient(value = "aika-order-service", path = "/order", fallback = OrderFeignFallback::class)
interface OrderFeignClient {

    @GetMapping("/endpoint/test")
    fun test(@RequestParam("param") param: String): String

    @GetMapping("/feign/user/subscription")
    fun userSubscription(@RequestParam("userId") userId: Long): BaseResult<List<UserSubscription?>?>

    @GetMapping("/feign/user/subscriptions")
    fun getSubscriptionList(@RequestBody req: ManageSubscriptionsQueryReq): BaseResult<PageResult<SubscriptionList>>

    @GetMapping("/feign/user/subscription/expired-time")
    fun getFeignUserSubscriptionExpiredTime(
        @RequestParam("userId") userId: Long, @RequestParam("country") country: String? = null
    ): BaseResult<LocalDateTime?>

}