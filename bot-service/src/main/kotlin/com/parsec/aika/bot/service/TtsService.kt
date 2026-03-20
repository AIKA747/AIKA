package com.parsec.aika.bot.service

interface TtsService {

    fun tts(text: String, voiceName: String?, uploadType: UploadType? = UploadType.s3): String
}

enum class UploadType {
    s3, did
}