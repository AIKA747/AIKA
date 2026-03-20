package com.parsec.aika.order.endpint

import cn.hutool.core.util.StrUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.order.model.vo.req.OrderEndpointQueryVo
import com.parsec.aika.order.model.vo.resp.FeignUserSubscriptionsListVo
import com.parsec.aika.order.model.vo.resp.GetFeignSubscriptionResp
import com.parsec.aika.order.model.vo.resp.GetIncomeDataResp
import com.parsec.aika.order.model.vo.resp.GetSubDataResp
import com.parsec.aika.order.service.OrderService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import javax.annotation.Resource

@RestController
class OrderEndpoint {

    @Value("\${custom.freeCountry:}")
    private var freeCountry: String? = null

    @Resource
    private lateinit var orderService: OrderService

    @GetMapping("/endpoint/test")
    fun test(param: String?): String {
        StaticLog.info("/endpoint/test:$param")
        return "order:endpoint:$param"
    }

    /**
     * 用户订阅列表
     */
    @PostMapping("/feign/user/subscriptions")
    fun userSubscriptions(@RequestBody queryVo: OrderEndpointQueryVo): BaseResult<PageResult<FeignUserSubscriptionsListVo>> {
        // 查询订单表，按照userId分组，查询出来的就是用户的订阅信息
        // 按用户最后一条成功的订单数据为准
        return BaseResult.success(orderService.feignUserSuccessOrderList(queryVo))
    }

    /**
     * 查询用户订阅信息
     */
    @GetMapping("/feign/user/subscription")
    fun getFeignUserSubscription(userId: Long): BaseResult<List<GetFeignSubscriptionResp>> {
        return BaseResult.success(orderService.getFeignUserSubscription(userId))
    }


    /**
     * 用户订阅过期时间
     */
    @GetMapping("/feign/user/subscription/expired-time")
    fun getFeignUserSubscriptionExpiredTime(userId: Long, country: String?): BaseResult<LocalDateTime?> {
        if (StrUtil.isNotBlank(freeCountry) && StrUtil.isNotBlank(country) && freeCountry!!.contains(country!!)) {
            return BaseResult.success(LocalDateTime.now().plusDays(1))
        }
        val feignUserSubscription = orderService.getFeignUserSubscription(userId)
        return if (feignUserSubscription.isNotEmpty()) BaseResult.success(feignUserSubscription.last().expiredDate)
        else BaseResult.success(null)
    }


    /**
     * 根据国家日期查询收入
     */
    @GetMapping("/feign/user/income/data")
    fun getFeignIncomeData(date: String, country: String): BaseResult<GetIncomeDataResp> {
        return BaseResult.success(orderService.getFeignIncomeData(date, country))
    }


    /**
     * 根据国家日期查询订阅
     */
    @GetMapping("/feign/user/subscribers/data")
    fun getFeignSubscribersData(date: String, country: String): BaseResult<GetSubDataResp> {
        return BaseResult.success(orderService.getFeignSubscribersData(date, country))
    }

}