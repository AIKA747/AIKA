package com.parsec.aika.user.endpoint

import com.parsec.aika.common.model.vo.AppUserVO
import com.parsec.aika.user.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class UserInfoController {

    @Autowired
    private lateinit var userService: UserService


    @GetMapping("/feign/user/info")
    fun userInfo(userId: Long): AppUserVO? {
        return userService.queryUserInfo(userId)
    }

}