package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.em.RedisKeyPrefix
import com.parsec.aika.user.model.vo.req.AppEmailVerifyReq
import com.parsec.aika.user.model.vo.req.ResetPasswordReq
import com.parsec.aika.user.model.vo.req.UpdateEmailReq
import com.parsec.aika.user.model.vo.req.VerifyNewEmailReq
import com.parsec.aika.user.service.UserEmailService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppUserEmailController {

    @Resource
    private lateinit var userEmailService: UserEmailService

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    /**
     * 新邮箱验证链接发送
     */
    @PostMapping("/app/user-email/verify")
    fun verifyNewEmail(@Validated @RequestBody req: VerifyNewEmailReq, user: LoginUserInfo): BaseResult<String> {
//        Assert.notBlank(req.password, "password can not empty")
        return BaseResult.success(userEmailService.verifyNewEmailV2(req.email!!, user.userId!!))
    }

    /**
     * 新邮箱验证链接发送
     */
    @PostMapping("/app/verify-old-email")
    fun verifyOldEmail(user: LoginUserInfo): BaseResult<String> {
        return BaseResult.success(userEmailService.verifyOldEmail(user))
    }

    /**
     * 忘记密码——发送邮件
     */
    @PostMapping("/public/user/reset-pwd-email")
    fun forgotPasswordSendEmail(@Validated @RequestBody req: VerifyNewEmailReq): BaseResult<Void> {
        userEmailService.forgotPasswordSendEmail(req.email!!)
        return BaseResult.success()
    }

    /**
     * 重置密码
     */
    @PutMapping("/public/password/reset")
    fun resetPassword(@Validated @RequestBody req: ResetPasswordReq): BaseResult<Void> {
        userEmailService.resetPassword(req)
        return BaseResult.success()
    }

    /**
     * 使用条款
     */
    @GetMapping("/public/use-terms")
    fun useTerms(): BaseResult<Any> {
        return BaseResult.success(stringRedisTemplate.opsForValue().get(RedisKeyPrefix.userTerms.name) ?: "")
    }

    /**
     * 隐私政策
     */
    @GetMapping("/public/confidentiality-policy")
    fun confidentialityPolicy(): BaseResult<Any> {
        return BaseResult.success(
            stringRedisTemplate.opsForValue().get(RedisKeyPrefix.confidentialityPolicy.name) ?: ""
        )
    }


    /**
     * 邮箱验证
     * 邮箱验证，会通过邮件的方式发送一个验证链接（前端H5页面），用户打开H5页面时(通过调用该接口)标记该邮箱已验证
     */
    @PutMapping("/public/register-email-verify")
    fun registerEmailVerify(@Validated @RequestBody vo: AppEmailVerifyReq): BaseResult<String> {
        return BaseResult.success(userEmailService.registerEmailVerify(vo))
    }

    /**
     *
     */
    @PutMapping("/public/old-email-verify-status")
    fun updateEmailVerify(@Validated @RequestBody req: UpdateEmailReq): BaseResult<Void> {
        userEmailService.oldEmailVerify(req)
        return BaseResult.success()
    }

}