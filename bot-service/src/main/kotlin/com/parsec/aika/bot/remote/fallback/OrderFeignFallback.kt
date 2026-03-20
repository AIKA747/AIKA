package com.parsec.aika.bot.remote.fallback

import com.parsec.aika.bot.remote.OrderFeignClient
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class OrderFeignFallback : OrderFeignClient {
    override fun getFeignUserSubscriptionExpiredTime(userId: Long, country: String?): BaseResult<LocalDateTime?> {
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, null)
    }

}