package com.parsec.aika.content.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import com.parsec.aika.content.gpt.ChatMessage
import com.parsec.aika.content.gpt.ChatRequestModel
import com.parsec.aika.content.gpt.OpenaiRestHandler
import com.parsec.aika.content.service.EstimatedWeightService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class EstimatedWeightServiceImpl : EstimatedWeightService {

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler


    override fun estimatedWeight(productDescription: String?): String {
        // 构建消息列表
        val messages = listOf(
            ChatMessage(
                "system", """
                    You are an experienced cross-border e-commerce professional who frequently sources products from 1688. You are very familiar with the products on 1688. Based on your experience, what would be the estimated weight of the following product in grams for cross-border shipping? 
                    The user's message template is:{"productDescription":"A description of an item that requires an estimated weight"}.
                    Template for response messages:{"weight":"Return the estimated weight of the item in grams","description":"A detailed description of the estimated weight"}
                """.trimMargin()
            ),
            ChatMessage("user", """{"productDescription":"$productDescription"}""")
        )
        //ChatRequestModel("gpt-3.5-turbo", messages)
        val postResp = openaiRestHandler.doPost(
            "https://api.openai.com/v1/chat/completions", JSONUtil.toJsonStr(ChatRequestModel("gpt-4o", messages))
        )
        val jsonObject = JSONObject(postResp)
        val error = jsonObject.getStr("error")
        Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)

        val message = JSONUtil.getByPath(jsonObject, "choices[0].message", "{}")
        val replaceMsg = message.replace("""\n""", """\\n""").replace("""\r""", """\\r""")
        val jsonObject1 = JSONObject(replaceMsg)
        return jsonObject1.getStr("content")
    }
}