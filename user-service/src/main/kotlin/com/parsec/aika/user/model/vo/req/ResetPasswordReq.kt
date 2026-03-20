package com.parsec.aika.user.model.vo.req

import com.parsec.trantor.validator.annotation.Pwd
import jakarta.validation.constraints.NotBlank

/**
 * 重置密码
 */
class ResetPasswordReq {

    /**
     * 校验码，邮件链接中生成的校验码
     */
    @NotBlank(message = "cannot be empty")
    var clientCode: String? = null

    /**
     * 校验码，邮件链接中生成的校验码
     */
    @NotBlank(message = "cannot be empty")
    var verifyCode: String? = null

    /**
     * 密码，密码
     */
    @Pwd
    @NotBlank(message = "cannot be empty")
    var password: String? = null

}