package com.parsec.aika.bot.gpt

import cn.hutool.core.lang.Assert
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.mapper.GptReqLogMapper
import com.parsec.aika.common.model.entity.GptReqLog
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import javax.annotation.PreDestroy

@RefreshScope
@Component
class DeepseekRestHandler {

    @Value("\${ai.deepseek.api-key:}")
    private val apiKey: String? = null

    @Autowired
    private lateinit var gptReqLogMapper: GptReqLogMapper

    private val executorService = ThreadUtil.newExecutor(5, 10)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }

    fun doPost(url: String, data: String?): String {
        StaticLog.debug("DeepseekRestHandler.doPost url: {}\n data:{}", url, data)
        val startTime = System.currentTimeMillis()
        val request = HttpUtil.createPost(url).header("Content-Type", " application/json")
            .header("Authorization", "Bearer $apiKey").header("OpenAI-Beta", "assistants=v2")
        if (JSONUtil.isTypeJSON(data)) {
            request.body(data)
        }
        val response = request.execute()
        val body = response.body()
        val endTime = System.currentTimeMillis()
        //记录日志
        this.reqLog(url, "post", data ?: "", response.status, body, endTime - startTime)
        StaticLog.debug("DeepseekRestHandler.doPost resp: {}", body)
        Assert.state(response.isOk, JSONUtil.getByPath(JSONUtil.parseObj(body), "error.message")?.toString())
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