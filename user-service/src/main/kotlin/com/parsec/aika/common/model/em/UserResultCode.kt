package com.parsec.aika.common.model.em

import com.parsec.trantor.common.response.ResultCode

enum class UserResultCode(var code: Int, var message: String) : ResultCode {

    NOT_SUBSCRIBED(2001, "You are not a subscribed user"),

    SUBSCRIBED_EXPIRED(2002, "Subscription has expired"),

    USER_NOT_EXIST(4004, "The user has been deregistered"),

    EMAIL_NOT_VERIFY(3001, "Email not verified"),

    EMAIL_LIMIT(6002, "You can request a new code in a minute");

    override fun code(): Int {
        return this.code
    }

    override fun message(): String {
        return this.message
    }

}