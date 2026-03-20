package com.parsec.aika.admin.remote

import com.parsec.aika.admin.model.vo.resp.GetIncomeDataResp
import com.parsec.aika.admin.model.vo.resp.GetSubDataResp
import com.parsec.aika.admin.remote.fallback.OrderFeignFallback
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-order-service", fallback = OrderFeignFallback::class)
interface OrderFeignClient {

    /**
     * 根据国家日期查询收入
     */
    @GetMapping("/order/feign/user/income/data")
    fun getFeignIncomeData(@RequestParam date: String, @RequestParam country: String): BaseResult<GetIncomeDataResp>


    /**
     * 根据国家日期查询订阅
     */
    @GetMapping("/order/feign/user/subscribers/data")
    fun getFeignSubscribersData(@RequestParam date: String, @RequestParam country: String): BaseResult<GetSubDataResp>

}