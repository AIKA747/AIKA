package com.parsec.aika.bot.remote

import com.parsec.aika.bot.remote.fallback.UserFeignClientFallback
import com.parsec.aika.common.model.dto.AppUserVO
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-user-service", path = "/user", fallback = UserFeignClientFallback::class)
interface UserFeignClient {


    @PostMapping("/fegin/bot/user/task")
    fun createBotUserTask(@RequestParam taskId: Int, @RequestParam cron: String): BaseResult<*>

    @PostMapping("/fegin/bot/post/task")
    fun createBotPostTask(@RequestParam botId: Long, @RequestParam cron: String): BaseResult<*>

    @GetMapping("/feign/user/info")
    fun userInfo(@RequestParam("userId") userId: Long): AppUserVO?

}
