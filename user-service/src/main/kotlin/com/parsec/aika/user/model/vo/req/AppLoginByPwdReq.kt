package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotBlank
import java.io.Serializable

/**
 * app通过密码登录
 */
class AppLoginByPwdReq : Serializable {

    /**
     * 用户账户，手机号或邮箱
     */
    @NotBlank(message = "Invalid account or password")
    var account: String? = null

    /**
     * 密码不能为空
     */
    @NotBlank(message = "Invalid account or password")
    var password: String? = null

    /**
     * 国家
     */
    var country: String? = null

    /**
     * 语言
     */
    var language: String? = null

}