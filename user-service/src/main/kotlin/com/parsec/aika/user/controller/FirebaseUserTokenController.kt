package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.service.FirebaseUserTokenService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class FirebaseUserTokenController {

    @Resource
    private lateinit var firebaseUserTokenService: FirebaseUserTokenService

    /**
     * 绑定firebasetoken
     */
    @PostMapping("/app/firebase/bind/{token}")
    fun bind(@PathVariable token: String, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        firebaseUserTokenService.bind(loginUserInfo.userId!!, token)
        return BaseResult.success()
    }

}