package com.parsec.aika.content.gpt

import cn.hutool.core.thread.ThreadUtil
import cn.hutool.http.HttpRequest
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.mapper.GptReqLogMapper
import com.parsec.aika.common.model.entity.GptReqLog
import jakarta.annotation.PreDestroy
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component
import java.io.File
import java.time.LocalDateTime

@RefreshScope
@Component
class OpenaiRestHandler {

    @Value("\${ai.openai.api-key:}")
    private val apiKey: String? = null

    @Value("\${ai.openai.proxy.enabled:false}")
    private val proxyEnabled: Boolean = false

    @Value("\${ai.openai.proxy.host:127.0.0.1}")
    private val proxyHost: String? = null

    @Value("\${ai.openai.proxy.port:7980}")
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
        val request =
            HttpUtil.createGet(url).header("Content-Type", "application/json").header("Authorization", "Bearer $apiKey")
                .header("OpenAI-Beta", "assistants=v1")
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "get", "", response.status, body, endTime - startTime)
        StaticLog.debug("OpenaiRestHandler.doGet resp: {}", body)
        return body
    }

    fun doPost(url: String, data: String?): String {
        StaticLog.debug("OpenaiRestHandler.doPost url: {}\n data:{}", url, data)
        val startTime = System.currentTimeMillis()
        val request = HttpUtil.createPost(url).header("Content-Type", " application/json")
            .header("Authorization", "Bearer $apiKey").header("OpenAI-Beta", "assistants=v1")
        if (proxyEnabled) {
            request.setHttpProxy("127.0.0.1", 7890)
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
        return body
    }

    fun uploadFile(purpose: String, file: File): String {
        StaticLog.info("文件大小：{}", file.length())
        val request: HttpRequest =
            HttpRequest.post("https://api.openai.com/v1/files").header("Authorization", "Bearer $apiKey")
                .form("purpose", purpose).form("file", file)
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val body = request.execute().body()
        StaticLog.info("OpenaiRestHandler.uploadFile resp: {}", body)
        return body
    }

    /**
     * 语音转文本
     */
    fun stt(file: File): String {
        StaticLog.debug("文件名：{}", file.name)
        StaticLog.debug("语音文件：{}", file.length())
        val url = "https://api.openai.com/v1/audio/transcriptions"
        val startTime = System.currentTimeMillis()
        val request: HttpRequest = HttpRequest.post(url).header("Authorization", "Bearer $apiKey")
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
        return body
    }

    /**
     * 对文本输入是否敏感进行分类
     */
    fun moderations(text: String): String {
        val url = "https://api.openai.com/v1/moderations"
        val startTime = System.currentTimeMillis()
        val request: HttpRequest =
            HttpRequest.post(url).header("Authorization", "Bearer $apiKey").header("Content-Type", "application/json")
                .body("""{"input": "$text"}""")
        if (proxyEnabled) {
            request.setHttpProxy(proxyHost, proxyPort!!)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "post", text, response.status, body, endTime - startTime)
        StaticLog.debug("OpenaiRestHandler.moderations resp: {}", body)
        return body
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