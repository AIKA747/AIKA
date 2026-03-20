package com.parsec.aika.content.service

/**
 * 语音转文字
 */
interface SttService {
    /**
     * 语音转文字
     */
    fun stt(speechUrl: String): String


}