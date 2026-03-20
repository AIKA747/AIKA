package com.parsec.aika.user.service

interface UserChatNumService {
    /**
     * 用户可聊天的次数
     */
    fun getUserEnableChatNum(userId: Long): Int
}