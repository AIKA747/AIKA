package com.parsec.aika.common.model.em

import com.parsec.trantor.common.response.ResultCode

enum class BotPostResultCode(var code: Int, var message: String) : ResultCode {

    BOT_NOT_EXIST(4001, "Robots do not exist"),

    BOT_NOT_ONLINE(4002, "The robot is not online yet"),

    BOT_TASK_DISABLED(4002, "The current bot task is closed");

    override fun code(): Int {
        return this.code
    }

    override fun message(): String {
        return this.message
    }
}