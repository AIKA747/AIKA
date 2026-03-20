package com.parsec.aika.content.service

interface PostConfigService {

    fun postCreateBlockedEnabled(): Boolean

    fun postCreateBlockedNumber(): Int

    fun setPostCreateBlockedEnabled(value: Boolean)

    fun setPostCreateBlockedNumber(value: Int)
}