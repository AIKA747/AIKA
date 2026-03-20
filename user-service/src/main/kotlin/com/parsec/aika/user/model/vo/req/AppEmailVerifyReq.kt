package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotNull

class AppEmailVerifyReq {

    /**
     * url链接中带的clientCode参数
     */
    @NotNull
    var clientCode: String? = null

    /**
     * url链接中带的clientCode参数
     */
    @NotNull
    var verifyCode: String? = null

}