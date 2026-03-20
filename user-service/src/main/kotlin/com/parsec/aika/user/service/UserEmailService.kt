package com.parsec.aika.user.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.AppEmailVerifyReq
import com.parsec.aika.user.model.vo.req.AppVerifyEmailReq
import com.parsec.aika.user.model.vo.req.ResetPasswordReq
import com.parsec.aika.user.model.vo.req.UpdateEmailReq
import com.parsec.aika.user.model.vo.resp.AppUserResp

interface UserEmailService {

    /**
     * （登录）注册邮箱验证
     * 返回clientCode
     */
    fun verifyEmail(req: AppVerifyEmailReq): String

    /**
     * 新邮箱验证链接发送
     * 返回clientCode
     */
    fun verifyNewEmail(email: String, userId: Long, newPwd: String): String

    /**
     * 忘记密码——发送邮件
     */
    fun forgotPasswordSendEmail(email: String)

    /**
     * 重置密码
     */
    fun resetPassword(req: ResetPasswordReq)

    /**
     * token置换
     * 发送注册邮件后，在app端通过轮询方式调用该接口来校验该邮箱是否已通过验证，通过验证则注册成功返回用户token
     */
    fun refreshToken(clientCode: String): AppUserResp?

    /**
     * 邮箱注册——验证邮箱
     */
    fun registerEmailVerify(vo: AppEmailVerifyReq): String?

    /**
     * 旧邮箱验证
     */
    fun verifyOldEmail(user: LoginUserInfo): String

    /**
     * 验证旧邮箱链接并发送链接到新邮箱
     */
    fun oldEmailVerify(req: UpdateEmailReq)

    fun emailHashCode(email: String): String

    /**
     * 发送注册邮件验证
     */
    fun verifyEmailV2(req: AppVerifyEmailReq): Any?

    /**
     * 更换邮箱
     */
    fun verifyNewEmailV2(email: String, userId: Long): String?

}