package com.parsec.aika.bot.model.vo.req

/** 关闭消息提醒请求对象 */
data class AppChatroomNotificationOffReq(
        /** 聊天室id */
        var roomId: Int? = null,

        /** 通知关闭类型: ONE_HOUR,EIGHT_HOUR,ONE_DAY,ONE_WEEK,ALWAYS */
        var notifyTurnOff: String? = null
)
