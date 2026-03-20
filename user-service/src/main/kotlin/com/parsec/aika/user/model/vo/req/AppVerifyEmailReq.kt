package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

/**
 * app验证邮箱
 */
class AppVerifyEmailReq {

    /**
     * 邮箱
     */
    @Email
    @NotBlank(message = "cannot be empty")
    var email: String? = null

    /**
     * 密码不能为空
     */
//    @Pwd(message = "The password should be at least 8 digits, including any 3 of uppercase and lowercase letters, numbers, or special characters")
//    @NotBlank(message = "cannot be empty")
    var password: String? = null

    //    @NotBlank(message = "cannot be empty")
    var country: String? = "US"

    var language: String? = "en"

}