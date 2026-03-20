package com.parsec.aika.admin.remote

import com.parsec.aika.admin.remote.fallback.ContentFeignFallback
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam

@FeignClient(value = "aika-content-service", path = "/content", fallback = ContentFeignFallback::class)
interface ContentFeignClient {

    @GetMapping("/feign/translate")
    fun translateLanguage(@RequestParam("text") text: String, @RequestParam("language") language: String): String?

}