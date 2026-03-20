package com.parsec.aika.user.remote.fallback

import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.dto.SubscriptionList
import com.parsec.aika.common.model.dto.UserSubscription
import com.parsec.aika.user.model.vo.req.ManageSubscriptionsQueryReq
import com.parsec.aika.user.remote.OrderFeignClient
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class OrderFeignFallback(private val cause: Throwable? = null) : OrderFeignClient {

    override fun test(param: String): String {
        return "服务降级返回:$param"
    }

    override fun userSubscription(userId: Long): BaseResult<List<UserSubscription?>?> {
        StaticLog.error("查询用户订阅信息列表失败")
        cause?.printStackTrace()
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, emptyList())
    }

    override fun getSubscriptionList(req: ManageSubscriptionsQueryReq): BaseResult<PageResult<SubscriptionList>> {
        cause?.printStackTrace()
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, PageResult())
    }

    override fun getFeignUserSubscriptionExpiredTime(userId: Long, country: String?): BaseResult<LocalDateTime?> {
        cause?.printStackTrace()
        return BaseResult.failure(BaseResultCode.INTERFACE_INNER_INVOKE_ERROR, null)
    }
}