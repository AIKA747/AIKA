package com.parsec.aika.bot.service

interface UserOnlineService {

    /**
     * 用户是否在线
     */
    fun online(userId: Long): Boolean

    /**
     * 手动标记用户在线，主要用来测试
     */
    fun onlineFlag(userId: Long): Boolean?


}