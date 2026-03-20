package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotNull

class UpdatePasswordReq {

    /**
     * 新密码
     */
    @NotNull
    var newPwd: String? = null

    /**
     * 原密码
     */
    @NotNull
    var oldPwd: String? = null

}