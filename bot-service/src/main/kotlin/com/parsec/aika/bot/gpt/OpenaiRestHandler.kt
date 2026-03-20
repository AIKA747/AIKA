package com.parsec.aika.bot.gpt

import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.http.HttpRequest
import cn.hutool.http.HttpUtil
import cn.hutool.http.Method
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.mapper.GptReqLogMapper
import com.parsec.aika.common.model.entity.GptReqLog
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component
import java.io.File
import java.time.LocalDateTime
import java.util.*
import javax.annotation.PreDestroy

@RefreshScope
@Component
class OpenaiRestHandler {

    @Value("\${ai.openai.api-key:}")
    private val openaiApiKey: String? = null

    @Value("\${ai.openai.proxy.enabled:false}")
    private val proxyEnabled: Boolean = false

    @Value("\${ai.openai.proxy.host:127.0.0.1}")
    private val proxyHost: String? = null

    @Value("\${ai.openai.proxy.port:7890}")
    private val proxyPort: Int? = null

    @Autowired
    private lateinit var gptReqLogMapper: GptReqLogMapper

    private val executorService = ThreadUtil.newExecutor(5, 10)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    fun doGet(url: String): String {
        StaticLog.debug("OpenaiRestHandler.doGet: {}", url)
        val startTime = System.currentTimeMillis()
        val request = HttpUtil.createGet(url).header("Content-Type", "application/json")
            .header("Authorization", "Bearer $openaiApiKey").header("OpenAI-Beta", "assistants=v2")
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "get", "", response.status, body, endTime - startTime)
        StaticLog.debug("OpenaiRestHandler.doGet resp: {}", body)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
        return body
    }

    fun doPost(url: String, data: String?): String {
        StaticLog.debug("OpenaiRestHandler.doPost url: {}\n data:{}", url, data)
        val startTime = System.currentTimeMillis()
        val request = HttpUtil.createPost(url).header("Content-Type", " application/json")
            .header("Authorization", "Bearer $openaiApiKey").header("OpenAI-Beta", "assistants=v2")
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost!!, proxyPort!!)
        }
        if (JSONUtil.isTypeJSON(data)) {
            request.body(data)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "post", data ?: "", response.status, body, endTime - startTime)
        StaticLog.debug("OpenaiRestHandler.doPost resp: {}", body)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
        return body
    }

    fun doDelete(url: String): String {
        StaticLog.debug("OpenaiRestHandler.doGet: {}", url)
        val startTime = System.currentTimeMillis()
        val request = HttpUtil.createRequest(Method.DELETE, url).header("Content-Type", "application/json")
            .header("Authorization", "Bearer $openaiApiKey").header("OpenAI-Beta", "assistants=v2")
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "delete", "", response.status, body, endTime - startTime)
        StaticLog.debug("OpenaiRestHandler.doGet resp: {}", body)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
        return body
    }

    fun uploadFile(purpose: String, file: File): String {
        StaticLog.debug("文件大小：{}", file.length())
        val request: HttpRequest =
            HttpRequest.post("https://api.openai.com/v1/files").header("Authorization", "Bearer $openaiApiKey")
                .form("purpose", purpose).form("file", file)
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        StaticLog.debug("OpenaiRestHandler.uploadFile resp: {}", body)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
        return body
    }

    /**
     * 语音转文本
     */
    fun stt(file: File): String {
        StaticLog.debug("文件名：{}", file.name)
        StaticLog.debug("语音文件：{}", file.length())
        val url = "https://api.openai.com/v1/audio/transcriptions";
        val startTime = System.currentTimeMillis()
        val request: HttpRequest = HttpRequest.post(url).header("Authorization", "Bearer $openaiApiKey")
            .header("Content-Type", "multipart/form-data").form("model", "whisper-1").form("file", file)
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "post", "file:${file.name}", response.status, body, endTime - startTime)
        StaticLog.debug("OpenaiRestHandler.stt resp: {}", body)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
        return body
    }

    fun imageToText(describe: String, imageUrl: String): String {
        StaticLog.debug("图片描述：{}", describe)
        StaticLog.debug("图片链接：{}", imageUrl)
        val base64 = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(HttpUtil.downloadBytes(imageUrl))
        val url = "https://api.openai.com/v1/chat/completions"
        val reqParams = """
                {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "$describe"
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": "$base64"
                                    }
                                }
                            ]
                        }
                    ],
                    "max_tokens": 300
                }
                """.trimIndent()
        val startTime = System.currentTimeMillis()
        val request: HttpRequest = HttpRequest.post(url).header("Authorization", "Bearer $openaiApiKey")
            .header("Content-Type", "application/json").body(
                reqParams
            )
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "post", reqParams, response.status, body, endTime - startTime)
        StaticLog.debug("OpenaiRestHandler.imageToText resp: {}", body)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
        return body
    }

    fun textToImage(describe: String): Any? {
        val url = "https://api.openai.com/v1/images/generations"
        val reqParams = """
                {
                    "model": "dall-e-3",
                    "prompt": "$describe",
                    "n": 1,
                    "size": "1024x1024"
                  }
                """.trimIndent()
        val startTime = System.currentTimeMillis()
        val request: HttpRequest = HttpRequest.post(url).header("Authorization", "Bearer $openaiApiKey")
            .header("Content-Type", "application/json").body(
                reqParams
            )
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "post", reqParams, response.status, body, endTime - startTime)
        StaticLog.info("OpenaiRestHandler.textToImage resp: {}", body)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
        return body
    }

    fun tts(text: String, voiceName: String?): ByteArray {
        val url = "https://api.openai.com/v1/audio/speech"
        val reqParams = """
            {
                "model": "tts-1",
                "input": "$text",
                "voice": "$voiceName"
            }
        """.trimIndent()
        val startTime = System.currentTimeMillis()
        val request: HttpRequest = HttpRequest.post(url).header("Authorization", "Bearer $openaiApiKey")
            .header("Content-Type", "application/json").body(
                reqParams
            )
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "post", reqParams, response.status, body ?: "", endTime - startTime)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
        return response.bodyBytes()
    }

    private fun reqLog(
        url: String, method: String, reqParams: String, respStatus: Int, respResult: String, times: Long
    ) {
        executorService.execute {
            gptReqLogMapper.insert(GptReqLog().apply {
                this.url = url
                this.method = method
                this.reqParams = reqParams
                this.respStatus = respStatus
                this.respResult = respResult
                this.times = times
                this.createdAt = LocalDateTime.now()
            })
        }
    }

}