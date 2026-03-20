package com.parsec.aika.bot.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.http.HttpUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.service.FileUploadService
import com.parsec.aika.bot.service.TtsService
import com.parsec.aika.bot.service.UploadType
import com.parsec.aika.common.mapper.VoiceMapper
import com.parsec.aika.common.model.entity.Voice
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class MicrosoftTtsServiceImpl : TtsService {

    @Value("\${tts.microsoft.speechSubscriptionKey}")
    private val speechSubscriptionKey: String? = null

    @Value("\${tts.microsoft.serviceRegion}")
    private val serviceRegion: String? = null

    @Autowired
    private val fileUploadService: FileUploadService? = null

    @Resource
    private lateinit var voiceMapper: VoiceMapper

    override fun tts(text: String, voiceName: String?, uploadType: UploadType?): String {
        val voice =
            voiceMapper.selectOne(KtQueryWrapper(Voice::class.java).eq(Voice::voiceName, voiceName).last("limit 1"))
        Assert.notNull(voice, "$voice voice name not exit")
        val httpResponse = HttpUtil.createPost("https://${serviceRegion}.tts.speech.microsoft.com/cognitiveservices/v1")
            .header("Ocp-Apim-Subscription-Key", speechSubscriptionKey).header("Content-Type", "application/ssml+xml")
            .header("X-Microsoft-OutputFormat", "audio-16khz-128kbitrate-mono-mp3").header("User-Agent", "curl").body(
                """
                <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voice.locale}">
                    <voice name="$voiceName">$text</voice>
                </speak>
            """.trimIndent()
            ).execute()
        return fileUploadService!!.uploadFile(httpResponse.bodyStream().readBytes(), "mp3", "audio/mp3","audios")
    }
}