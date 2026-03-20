package com.parsec.aika.content.remote

import com.parsec.aika.common.model.vo.AppUserVO
import com.parsec.aika.content.remote.fallback.UserFeignFallback
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-user-service", path = "/user", fallback = UserFeignFallback::class)
interface UserFeignClient {

    @GetMapping("/feign/user/info")
    fun userInfo(@RequestParam("userId") userId: Long): AppUserVO?

    @GetMapping("/feign/user/blocked-user-id-list")
    fun getBlockedUserIdList(@RequestParam("userId") userId: Long): List<Long>?

}