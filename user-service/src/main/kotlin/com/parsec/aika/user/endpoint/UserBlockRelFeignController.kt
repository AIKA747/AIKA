package com.parsec.aika.user.endpoint

import com.parsec.aika.user.service.UserBlockRelService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class UserBlockRelFeignController {

    @Autowired
    private lateinit var userBlockRelService: UserBlockRelService


    @GetMapping("/feign/user/blocked-user-id-list")
    fun getBlockedUserIdList(userId: Long): List<Long>? {
        return userBlockRelService.getBlockedUserIdList(userId)
    }

}