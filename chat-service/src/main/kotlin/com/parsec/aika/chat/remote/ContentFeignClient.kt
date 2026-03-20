package com.parsec.aika.chat.remote

import com.parsec.aika.chat.remote.fallback.ContentFeignFallback
import com.parsec.trantor.common.response.BaseResult
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-content-service", path = "/content", fallback = ContentFeignFallback::class)
interface ContentFeignClient {

    @GetMapping("/fegin/moderations")
    fun moderations(@RequestParam("text") text: String): BaseResult<Boolean?>

}