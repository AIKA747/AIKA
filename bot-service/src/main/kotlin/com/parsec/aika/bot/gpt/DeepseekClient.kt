package com.parsec.aika.bot.gpt

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Component

@RefreshScope
@Component
class DeepseekClient {

    @Autowired
    private lateinit var deepseekRestHandler: DeepseekRestHandler

    @Value("\${ai.deepseek.model:deepseek-chat}")
    private val gptModel: String? = null

    @Value("\${ai.deepseek.url:https://api.deepseek.com/chat/completions}")
    private val gptUrl: String? = null

    fun send(
        prompt: String, returnJson: Boolean = true, model: String? = null, chatmessages: List<ChatMessage>
    ): String {
        StaticLog.info("DeepseekClient.send(),model:{},url:{}", gptModel, gptUrl)
        // 构建消息列表
        val messages = arrayListOf(ChatMessage("system", prompt))
        messages.addAll(chatmessages)
        val postResp = deepseekRestHandler.doPost(
            gptUrl!!,
            JSONUtil.toJsonStr(ChatRequestModel(if (StrUtil.isBlank(model)) gptModel!! else model!!, messages))
        )

        val jsonObject = JSONObject(postResp)
        val error = jsonObject.getStr("error")
        Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)

        val jsonArray = jsonObject.getJSONArray("choices")
        val jsonObject1 = jsonArray.getJSONObject(0)
        val message = jsonObject1.getJSONObject("message")
        val content = message.getStr("content")
        if (returnJson) {
            //提取json文本
            val regex = Regex("\\{.*?\\}")
            val matchResult = regex.find(content.replace("\n", ""))
            return getJsonStr(matchResult!!.value)
        }
        return content
    }

    fun getJsonStr(content: String): String {
        StaticLog.info("DeepseekClient.getJsonStr(),content:{}", content)
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