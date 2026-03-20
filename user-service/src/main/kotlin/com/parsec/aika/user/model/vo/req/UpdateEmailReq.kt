package com.parsec.aika.user.model.vo.req

import com.parsec.trantor.validator.annotation.Pwd
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

/**
 * 更新用户邮箱
 */
class UpdateEmailReq {

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

    @Email
    @NotNull(message = "cannot be empty")
    var newEmail: String? = null

    /**
     * 密码，密码
     */
    @Pwd(message = "The password should be at least 8 digits, including any 3 of uppercase and lowercase letters, numbers, or special characters")
    @NotBlank(message = "cannot be empty")
    var newPwd: String? = null

}