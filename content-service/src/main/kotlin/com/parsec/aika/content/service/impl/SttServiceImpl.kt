package com.parsec.aika.content.service.impl

import cn.hutool.core.io.FileUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.parsec.aika.content.gpt.OpenaiRestHandler
import com.parsec.aika.content.service.SttService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class SttServiceImpl : SttService {

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler

    override fun stt(speechUrl: String): String {
        val tempFile = FileUtil.createTempFile(
            ".${FileUtil.getSuffix(speechUrl)}", true
        )
        try {
            val fileLen = HttpUtil.downloadFile(speechUrl, tempFile)
            StaticLog.info("download file len: {}", fileLen)
            val sttResp = openaiRestHandler.stt(tempFile)
            val jsonObject = JSONObject(sttResp)
            return jsonObject.getStr("text") ?: "unrecognized audio"
        } finally {
            tempFile.delete()
        }
    }
}