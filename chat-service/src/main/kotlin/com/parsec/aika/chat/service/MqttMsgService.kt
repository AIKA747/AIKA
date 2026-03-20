package com.parsec.aika.chat.service

interface MqttMsgService {
    /**
     * 处理mqtt收到的消息
     */
    fun handler(user: String, paload: String)
}