package com.parsec.aika.content.remote

import com.parsec.aika.common.model.vo.req.BotImageUpdateReq
import com.parsec.aika.content.remote.fallback.BotFeignFallback
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody

@FeignClient(value = "aika-bot-service", path = "/bot", fallback = BotFeignFallback::class)
interface BotFeignClient {

    @PutMapping("/feign/bot/subscription/bot-image/update")
    fun updateBotImage(@RequestBody req: BotImageUpdateReq): BaseResult<*>
}