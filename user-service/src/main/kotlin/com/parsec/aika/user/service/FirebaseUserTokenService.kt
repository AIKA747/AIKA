package com.parsec.aika.user.service

interface FirebaseUserTokenService {

    fun bind(userId: Long, token: String)

    /**
     * 解绑用户token
     */
    fun unbindUserToken(userId: Long): Int
}