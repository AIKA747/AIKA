package com.parsec.aika.user.service

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.AppUserInfo
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.AppUserResp
import com.parsec.aika.user.model.vo.resp.LoginType

interface AuthService {
    /**
     * app用户账户密码登录
     */
    fun appLoginByPwd(account: String, password: String, country: String?, language: String?): AppUserResp

    /**
     * 获取当前app用户信息
     */
    fun appUserInfo(userInfo: LoginUserInfo): AppUserResp

    /**
     * 修改当前用户信息
     */
    fun editUserInfo(req: EditUserInfoReq, userInfo: LoginUserInfo): AppUserResp

    /**
     * 修改当前用户经纬度
     */
    fun editUserLocation(req: EditUserLocationReq, userInfo: LoginUserInfo)

    /**
     * 谷歌登录
     */
    fun postPublicGoogleLogin(req: PostPublicGoogleLoginReq): AppUserResp

    /**
     * 根据用户信息修改token
     */
    fun createToken(
        user: AppUserInfo,
        loginType: LoginType?,
        country: String? = null,
        language: String? = null,
        firstLogin: Boolean? = false,
        refresh: Boolean? = false
    ): AppUserResp

    /**
     * 手动使用户token过期
     */
    fun expireToken(userId: Long?)
    fun deleteUser(userId: Long?)
    fun appleLogin(req: AppleLoginReq): AppUserResp?
    fun facebookLogin(req: FacebookLoginReq): AppUserResp?
    fun getGoogleUserInfo(clientId: String, idToken: String): GoogleIdToken.Payload?

    /**
     * 校验用户密码
     */
    fun checkUserPassword(password: String, userId: Long)

    /**
     * 登出
     */
    fun logout(userInfo: LoginUserInfo): Int
}