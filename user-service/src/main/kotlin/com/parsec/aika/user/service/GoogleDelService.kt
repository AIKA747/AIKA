package com.parsec.aika.user.service

interface GoogleDelService {
    fun googleDelUser(email: String)
    fun googleDelUserData(clientCode: String, verifyCode: String)
}