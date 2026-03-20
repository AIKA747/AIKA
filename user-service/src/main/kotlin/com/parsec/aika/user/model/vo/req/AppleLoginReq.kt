package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotBlank

class AppleLoginReq {

    /**
     * 客户端通过用户授权获取到的idToken
     */
    @NotBlank
    var identityToken: String? = null

    /**
     * 苹果用户id
     */
    @NotBlank
    var appleUserId: String? = null

    /**
     * 国家,ISO 3166-1国际标准代码
     */
    var country: String? = "US"

    /**
     * 语言,ISO 639-1国际标准代码
     */
    var language: String? = "en"


}