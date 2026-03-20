package com.parsec.aika.chat.service

interface AppUserOnlineService {

    /**
     * 标记用户在线
     */
    fun online(userId: Long)

}