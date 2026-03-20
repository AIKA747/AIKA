package com.parsec.aika.user.controller

import com.parsec.aika.user.model.vo.req.AppVerifyEmailReq
import com.parsec.aika.user.model.vo.resp.AppUserResp
import com.parsec.aika.user.service.UserEmailService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class RegisterController {

    @Resource
    private lateinit var registerService: UserEmailService

    /**
     * 邮箱注册（登录）
     */
    @PostMapping("/public/verify-email")
    fun verifyEmail(@RequestBody @Validated req: AppVerifyEmailReq): BaseResult<String> {
        return BaseResult.success(registerService.verifyEmail(req))
    }

    /**
     * token 置换
     * 发送注册邮件后，在app端通过轮询方式调用该接口来校验该邮箱是否已通过验证，通过验证则注册成功返回用户token
     */
    @GetMapping("/public/refresh-token")
    fun refreshToken(clientCode: String): BaseResult<AppUserResp?> {
        return BaseResult.success(registerService.refreshToken(clientCode))
    }

    @PostMapping("/public/v2/verify-email")
    fun registerVerifyEmail(@RequestBody @Validated req: AppVerifyEmailReq): BaseResult<Any> {
        return BaseResult.success(registerService.verifyEmailV2(req))
    }


}