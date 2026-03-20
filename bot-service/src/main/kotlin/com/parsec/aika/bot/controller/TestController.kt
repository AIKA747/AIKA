package com.parsec.aika.bot.controller

import com.parsec.aika.bot.service.UserOnlineService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class TestController {

    @Resource
    private lateinit var onlineService: UserOnlineService


    @GetMapping("/public/test/online/status")
    fun testOnline(userId: Long): BaseResult<Boolean> {
        return BaseResult.success(onlineService.online(userId))
    }

    @GetMapping("/public/test/online/status-flag")
    fun testOnlineFlag(userId: Long): BaseResult<Boolean> {
        return BaseResult.success(onlineService.onlineFlag(userId))
    }

    @GetMapping("/public/health")
    fun health(): BaseResult<*> {
        return BaseResult.success()
    }

}