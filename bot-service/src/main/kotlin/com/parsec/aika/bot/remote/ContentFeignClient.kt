package com.parsec.aika.bot.remote

import com.parsec.aika.bot.remote.fallback.ContentFeignFallback
import com.parsec.aika.common.model.bo.StoryRecommendBO
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.common.model.vo.req.BotPostReq
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-content-service", path = "/content", fallback = ContentFeignFallback::class)
interface ContentFeignClient {

    @GetMapping("/feign/storyRecommend")
    fun storyRecommend(
        @RequestParam("userId") userId: Long,
        @RequestParam("tags") tags: String,
        @RequestParam("recommendStrategy") recommendStrategy: RecommendStrategy
    ): StoryRecommendBO?

    @GetMapping("/feign/translate")
    fun translateLanguage(@RequestParam("text") text: String, @RequestParam("language") language: String): String?

    @PostMapping("/feign/bot/create-post")
    fun createBotPost(@RequestBody botPostReq: BotPostReq): BaseResult<*>
}