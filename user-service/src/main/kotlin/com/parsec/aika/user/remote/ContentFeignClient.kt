package com.parsec.aika.user.remote

import com.parsec.aika.user.remote.fallback.ContentFeignFallback
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-content-service", path = "/content", fallback = ContentFeignFallback::class)
interface ContentFeignClient {
    @GetMapping("/feign/chat/num")
    fun chatNum(
        @RequestParam userId: Long,
        @RequestParam minTime: String?,
        @RequestParam maxTime: String?,
        @RequestParam storyId: Long?
    ): BaseResult<Int>

    @GetMapping("/feign/translate")
    fun translateLanguage(@RequestParam("text") text: String, @RequestParam("language") language: String): String?


    @PostMapping("/feign/user/notify")
    fun userNotify(
        @RequestParam("userId") userId: Long?,
        @RequestParam("username") username: String?,
        @RequestParam("jobId") jobId: Long?,
        @RequestParam("operator") operator: String?
    ): Boolean


    @PostMapping("/feign/delete/followRelation/{userId}")
    fun deleteFollowRelation(
        @PathVariable("userId") userId: Long,
    )
}