package com.parsec.aika.bot.service.impl

import cn.hutool.core.io.FileUtil
import cn.hutool.json.JSONObject
import com.parsec.aika.bot.gpt.OpenaiRestHandler
import com.parsec.aika.bot.service.SttService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.net.URL

@Service
class SttServiceImpl : SttService {

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler

    override fun stt(speechUrl: String): String {
        val tempFile = FileUtil.createTempFile(
            ".${FileUtil.getSuffix(speechUrl)}", true
        )
        try {
            val sttResp = openaiRestHandler.stt(FileUtil.writeFromStream(URL(speechUrl).openStream(), tempFile))
            val jsonObject = JSONObject(sttResp)
            return jsonObject.getStr("text") ?: "unrecognized audio"
        } finally {
            tempFile.delete()
        }
    }
}