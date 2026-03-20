package com.parsec.aika.user.remote

import com.parsec.aika.user.model.vo.resp.DictionaryResp
import com.parsec.aika.user.remote.fallback.BotFeignFallback
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import java.time.LocalDateTime

@FeignClient(value = "aika-bot-service", path = "/bot", fallback = BotFeignFallback::class)
interface BotFeignClient {

    @GetMapping("/feign/chat/num")
    fun chatNum(
        @RequestParam userId: Long,
        @RequestParam minTime: String?,
        @RequestParam maxTime: String?,
        @RequestParam botId: Long?
    ): BaseResult<Int>

    @GetMapping("/feign/dic")
    fun getDicList(@RequestParam dicType: String?): BaseResult<List<DictionaryResp>>


    @GetMapping("/feign/bot/bot-name-check")
    fun checkBotNameExists(@RequestParam name: String): BaseResult<Boolean>

    @GetMapping("/feign/group/notify/count")
    fun getChatroomMemberNotifycationCount(@RequestParam memberId: Long): Int
}
