package com.parsec.aika.content.gpt

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONArray
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component

@RefreshScope
@Component
class GptClient {

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler

    @Value("\${ai.openai.model:gpt-4o-mini}")
    private val gptModel: String? = null

    @Value("\${ai.openai.url:https://api.openai.com/v1/chat/completions}")
    private val gptUrl: String? = null

    /**
     * 网络采集信息
     */
    fun webSearch(input: String?): String {
        val url = "https://api.openai.com/v1/responses"
        val postResp = openaiRestHandler.doPost(
            url, """
            {
                "model": "gpt-4.1-mini",
                "tools": [{
                    "type": "web_search_preview",
                    "search_context_size": "medium"
                }],
                "input": "$input"
            }
        """.trimIndent()
        )
        val jsonObject = JSONObject(postResp)
        val error = jsonObject.getStr("error")
        Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)
        val jsonArray = jsonObject.getJSONArray("output")
        val jsonObject1 = jsonArray.map(JSONUtil::parseObj).find {
            it.getStr("type") == "message"
        }!!
        val content = JSONUtil.parseObj(jsonObject1.getJSONArray("content")[0])
        return content.getStr("text")
    }

    /**
     * 聊天请求
     */
    fun send(
        prompt: String,
        returnJson: Boolean = true,
        model: String? = null,
        chatmessages: List<ChatMessage>,
        useFun: Boolean? = false,
        jsonProperties: JSONObject? = null
    ): String {
        // 构建消息列表
        val messages = arrayListOf(ChatMessage("system", prompt))
        val requestModel = if (useFun == true) {
            val tools = JSONArray()
            tools.add(JSONObject().apply {
                this["type"] = "function"
                this["function"] = JSONObject().apply {
                    this["name"] = "get_object_info"
                    this["description"] = "Return structured information of the response"
                    this["parameters"] = jsonProperties
                }
            })
            ChatRequestModel(if (StrUtil.isBlank(model)) gptModel!! else model!!, messages, tools, JSONObject().apply {
                this["type"] = "function"
                this["function"] = JSONObject().apply {
                    this["name"] = "get_object_info"
                }
            })
        } else {
            ChatRequestModel(if (StrUtil.isBlank(model)) gptModel!! else model!!, messages)
        }

        messages.addAll(chatmessages)
        val postResp = openaiRestHandler.doPost(
            gptUrl!!, JSONUtil.toJsonStr(requestModel)
        )
        val jsonObject = JSONObject(postResp)
        val error = jsonObject.getStr("error")
        Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)
        val jsonArray = jsonObject.getJSONArray("choices")
        val jsonObject1 = jsonArray.getJSONObject(0)
        val message = jsonObject1.getJSONObject("message")
        if (useFun == true) {
            val jsonArray1 = message.getJSONArray("tool_calls")
            val jsonObject2 = jsonArray1.getJSONObject(0)
            val jsonObject3 = jsonObject2.getJSONObject("function")
            return jsonObject3.getStr("arguments")
        }
        val content = message.getStr("content")
        if (returnJson) {
            return getJsonStr(content)
        }
        return content
    }

    private fun getJsonStr(content: String): String {
        StaticLog.info("GptClient.getJsonStr(),content:{}", content)
        if (JSONUtil.isTypeJSON(content)) {
            StaticLog.info("content是否为json:{}", true)
            return content
        }
        StaticLog.info("content是否为json:{}", false)
        // 定义正则表达式匹配 JSON 数据
        val regex = Regex("\\{.*?\\}")
        // 查找匹配的字符串
        val matchResult = regex.find(content.replace("\n", ""))
        // 提取匹配的字符串
        if (null == matchResult || StrUtil.isBlank(matchResult.value)) {
            return """{"answer":"$content"}"""
        }
        return matchResult.value
    }

}

data class ChatMessage(val role: String, val content: String)

data class ChatRequestModel(
    val model: String,
    val messages: List<ChatMessage>,
    val tools: JSONArray? = null,
    val tool_choice: JSONObject? = null
)