package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotBlank

class VerifyNewEmailReq {

    @NotBlank(message = "can not empty")
    var email: String? = null

    var password: String? = null

}