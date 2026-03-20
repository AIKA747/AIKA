package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotBlank

/**
 * app通过密码登录
 */
class PostPublicGoogleLoginReq {

    /**
     * idToken
     */
    @NotBlank
    var idToken: String? = null

    var country: String? = "US"

    var language: String? = "en"

    var ostype: Ostype? = Ostype.ios

}

enum class Ostype(val clientId: String) {
    ios("600258585781-5d2slqlpdhtrhiro3vt48mml5uo2rt2c.apps.googleusercontent.com"),
    android("600258585781-j390oma5qjsp22r450jtr25gdbkr14p9.apps.googleusercontent.com")
}