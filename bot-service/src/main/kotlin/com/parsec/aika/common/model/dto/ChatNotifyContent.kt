package com.parsec.aika.common.model.dto

/**
 * 聊天消息通知
 */
class ChatNotifyContent : BaseNotifyContent() {

    /**
     * 聊天室id
     */
    var roomId: Int? = null

    /**
     * 发送消息的对象头像
     */
    var avatar: String? = null
}