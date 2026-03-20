package com.parsec.aika.user.controller

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.AppUserResp
import com.parsec.aika.user.service.AuthService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
class AuthController {

    @Autowired
    private lateinit var authService: AuthService

    /**
     * app用户登录
     */
    @PostMapping("/public/auth")
    fun appLoginByPwd(@RequestBody @Validated req: AppLoginByPwdReq): BaseResult<AppUserResp> {
        return BaseResult.success(authService.appLoginByPwd(req.account!!, req.password!!, req.country, req.language))
    }

    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/app/me")
    fun appCurrentUserInfo(userInfo: LoginUserInfo): BaseResult<AppUserResp> {
        return BaseResult.success(authService.appUserInfo(userInfo))
    }

    /**
     * 编辑用户信息
     */
    @PatchMapping("/app/info")
    fun editUserInfo(@RequestBody @Validated req: EditUserInfoReq, userInfo: LoginUserInfo): BaseResult<AppUserResp> {
        return BaseResult.success(authService.editUserInfo(req, userInfo))
    }

    /**
     * 编辑用户信息
     */
    @PatchMapping("/app/user-location")
    fun editUserLocation(@RequestBody @Validated req: EditUserLocationReq, userInfo: LoginUserInfo): BaseResult<Void> {
        authService.editUserLocation(req, userInfo)
        return BaseResult.success()
    }

    /**
     * 谷歌登录
     */
    @PostMapping("/public/google/login")
    fun postPublicGoogleLogin(@RequestBody @Validated req: PostPublicGoogleLoginReq): BaseResult<AppUserResp> {
        return BaseResult.success(authService.postPublicGoogleLogin(req))
    }

    @PostMapping("/public/apple/login")
    fun appleLogin(@RequestBody @Validated req: AppleLoginReq): BaseResult<AppUserResp> {
        return BaseResult.success(authService.appleLogin(req))
    }

    @PostMapping("/public/facebook/login")
    fun facebookLogin(@RequestBody @Validated req: FacebookLoginReq): BaseResult<AppUserResp> {
        return BaseResult.success(authService.facebookLogin(req))
    }

    @DeleteMapping("/app/delete")
    fun deleteUser(userInfo: LoginUserInfo): BaseResult<Void> {
        authService.deleteUser(userInfo.userId)
        return BaseResult.success()
    }

    @GetMapping("/public/umay/google/login")
    fun getGoogleUserInfo(clientId: String, idToken: String): BaseResult<GoogleIdToken.Payload> {
        return BaseResult.success(authService.getGoogleUserInfo(clientId, idToken))
    }


    @DeleteMapping("/app/logout")
    fun logout(userInfo: LoginUserInfo): BaseResult<*> {
        return BaseResult.success(authService.logout(userInfo))
    }

}