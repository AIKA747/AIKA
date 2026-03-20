package com.parsec.aika.chat.controller

import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {
    @GetMapping("/public/health")
    fun health(): BaseResult<*> {
        return BaseResult.success()
    }
}