package com.parsec.aika.chat.remote

import com.parsec.aika.chat.remote.fallback.UserFeignFallback
import com.parsec.aika.common.model.dto.CheckUserChatDTO
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-user-service", path = "/user", fallback = UserFeignFallback::class)
interface UserFeignClient {

    @GetMapping("/fegin/check/chat/info")
    fun checkUserChatInfo(
        @RequestParam userId: Long,
        @RequestParam botId: Long? = null,
        @RequestParam storyId: Long? = null,
        @RequestParam country: String? = null
    ): BaseResult<CheckUserChatDTO>

}