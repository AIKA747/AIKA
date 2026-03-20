package com.parsec.aika.bot.gpt

import cn.hutool.json.JSONArray
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component

@RefreshScope
@Component
class GptAssistantClient {

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler

    @Value("\${ai.openai.assistant.model:gpt-4o}")
    private var assistantModel: String? = "gpt-4o"

    /**
     * name： 助手名称
     * description： 助手描述
     * @return 助手id
     */
    fun createAssistant(name: String, description: String, model: String? = null): String {
        val req = JSONObject().apply {
            set("name", name)
            set("description", description)
            set("tools", listOf(JSONObject().apply {
                set("type", "code_interpreter")
            }))
            set("model", model ?: assistantModel)
        }
        val url = "https://api.openai.com/v1/assistants"
        val responseData = openaiRestHandler.doPost(url, JSONUtil.toJsonStr(req))
        return JSONUtil.parseObj(responseData).getStr("id")
    }

    /**
     * 修改助手信息
     */
    fun editAssistant(
        assistantId: String, name: String, description: String, model: String? = null
    ): JSONObject {
        val req = JSONObject().apply {
            set("name", name)
            set("description", description)
            set("tools", listOf(JSONObject().apply {
                set("type", "code_interpreter")
            }))
            set("model", model ?: assistantModel)
        }
        val url = "https://api.openai.com/v1/assistants/$assistantId"
        val responseData = openaiRestHandler.doPost(url, JSONUtil.toJsonStr(req))
        return JSONUtil.parseObj(responseData)
    }

    /**
     * 查询助手详情
     */
    fun assistantDetail(assistantId: String): JSONObject {
        val url = "https://api.openai.com/v1/assistants/$assistantId"
        val responseData = openaiRestHandler.doGet(url)
        return JSONUtil.parseObj(responseData)
    }

    /**
     * 删除助手
     */
    fun deleteAssistant(assistantId: String) {
        val url = "https://api.openai.com/v1/assistants/$assistantId"
        openaiRestHandler.doDelete(url)
    }

    /**
     * 查询助手列表
     */
    fun assistantList(): JSONArray {
        val url = "https://api.openai.com/v1/assistants"
        val responseData = openaiRestHandler.doGet(url)
        val jsonObject = JSONUtil.parseObj(responseData)
        return jsonObject.getJSONArray("data")
    }

    /**
     * 创建thread
     */
    fun createThread(): String {
        val url = "https://api.openai.com/v1/threads"
        val responseData = openaiRestHandler.doPost(url, "")
        return JSONUtil.parseObj(responseData).getStr("id")
    }

    /**
     * 线程详情
     */
    fun threadDetail(threadId: String): JSONObject {
        val url = "https://api.openai.com/v1/threads/$threadId"
        val responseData = openaiRestHandler.doGet(url)
        return JSONUtil.parseObj(responseData)
    }

    /**
     * 线程编辑
     */
    fun editThread(threadId: String, params: JSONObject): JSONObject {
        val url = "https://api.openai.com/v1/threads/$threadId"
        val responseData = openaiRestHandler.doPost(url, JSONUtil.toJsonStr(params))
        return JSONUtil.parseObj(responseData)
    }

    /**
     * 删除thread
     */
    fun deleteThread(threadId: String) {
        val url = "https://api.openai.com/v1/threads/$threadId"
        openaiRestHandler.doDelete(url)
    }

    /**
     * 添加消息
     */
    fun addMessage(threadId: String, message: ThreadMessage): String {
        val url = "https://api.openai.com/v1/threads/$threadId/messages"
        val responseData = openaiRestHandler.doPost(url, JSONUtil.toJsonStr(message))
        return JSONUtil.parseObj(responseData).getStr("id")
    }

    fun messageList(threadId: String, limit: Int? = 10): JSONArray {
        val url = "https://api.openai.com/v1/threads/${threadId}/messages?limit=$limit"
        val responseData = openaiRestHandler.doGet(url)
        return JSONUtil.parseObj(responseData).getJSONArray("data")
    }

    /**
     * 删除消息
     */
    fun deleteMessage(threadId: String, messageId: String) {
        val url = "https://api.openai.com/v1/threads/$threadId/messages/$messageId"
        openaiRestHandler.doDelete(url)
    }

    /**
     * 创建run and thread
     */
    fun createRunAndThread(assistantId: String, messages: List<ThreadMessage>): JSONObject {
        val req = JSONObject().apply {
            set("assistant_id", assistantId)
            set("thread", JSONObject().apply {
                set("messages", messages)
            })
        }
        val url = "https://api.openai.com/v1/threads/runs"
        val responseData = openaiRestHandler.doPost(url, JSONUtil.toJsonStr(req))
        return JSONUtil.parseObj(responseData)
    }

    /**
     * 查询线程运行详情
     */
    fun runStatus(threadId: String, runId: String): JSONObject {
        val url = "https://api.openai.com/v1/threads/$threadId/runs/$runId"
        val responseData = openaiRestHandler.doGet(url)
        return JSONUtil.parseObj(responseData)
    }


}

data class ThreadMessage(
    val role: String, val content: String
)