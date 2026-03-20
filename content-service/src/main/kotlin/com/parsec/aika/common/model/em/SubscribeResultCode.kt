package com.parsec.aika.common.model.em

import com.parsec.trantor.common.response.ResultCode

enum class SubscribeResultCode(var code: Int, var message: String) : ResultCode {

    NOT_SUBSCRIBED(2001, "You are not a subscribed user"),

    SUBSCRIBED_EXPIRED(2002, "Subscription has expired");

    override fun code(): Int {
        return this.code
    }

    override fun message(): String {
        return this.message
    }
}