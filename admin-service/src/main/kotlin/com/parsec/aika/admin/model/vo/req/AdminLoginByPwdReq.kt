package com.parsec.aika.admin.model.vo.req

import java.io.Serializable
import javax.validation.constraints.NotBlank

/**
 * 账号密码登录
 */
class AdminLoginByPwdReq : Serializable {

    /**
     * 管理员账户
     */
    @NotBlank(message = "用户名不能为空")
    var username: String? = null

    /**
     * 密码不能为空
     */
    @Transient
    @NotBlank(message = "密码不能为空")
    var password: String? = null

    @NotBlank(message = "clientCode不能为空")
    var clientCode: String? = null

    @NotBlank(message = "verifyCode不能为空")
    var verifyCode: String? = null

}