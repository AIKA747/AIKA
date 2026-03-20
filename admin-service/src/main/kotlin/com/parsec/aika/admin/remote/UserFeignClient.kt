package com.parsec.aika.admin.remote

import com.parsec.aika.admin.model.vo.resp.RemoteUserNumData
import com.parsec.aika.admin.remote.fallback.UserFeignFallback
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-user-service", fallback = UserFeignFallback::class)
interface UserFeignClient {

    /**
     * 获取注册用户country集合
     */
    @GetMapping("/user/feign/user/country")
    fun getUserCountryList(): BaseResult<List<String>>

    /**
     * 根据日期、城市，查询用户统计数
     * 日期格式：2024-01-22
     */
    @GetMapping("/user/feign/user/nums")
    fun getUserNums(
        @RequestParam("date") date: String, @RequestParam("country") country: String
    ): BaseResult<RemoteUserNumData>

}