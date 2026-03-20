package com.parsec.aika.bot.service.impl

import com.parsec.aika.bot.gpt.OpenaiRestHandler
import com.parsec.aika.bot.service.DidService
import com.parsec.aika.bot.service.FileUploadService
import com.parsec.aika.bot.service.TtsService
import com.parsec.aika.bot.service.UploadType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Primary
import org.springframework.stereotype.Service
import software.amazon.awssdk.core.internal.util.Mimetype

@Primary
@Service("openaiTtsServiceImpl")
class OpenaiTtsServiceImpl : TtsService {

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler

    @Autowired
    private lateinit var didService: DidService

    @Autowired
    private lateinit var fileUploadService: FileUploadService

    override fun tts(text: String, voiceName: String?, uploadType: UploadType?): String {
        val bytes = openaiRestHandler.tts(text, voiceName)
        if (uploadType == UploadType.did) {
            return didService.uploadFile(bytes)
        }
        return fileUploadService.uploadFile(bytes, "mp3", Mimetype.MIMETYPE_OCTET_STREAM,"audios")
    }
}