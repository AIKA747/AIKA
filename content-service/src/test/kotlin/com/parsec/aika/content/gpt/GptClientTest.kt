//package com.parsec.aika.content.gpt
//
//import cn.hutool.core.lang.Assert
//import cn.hutool.json.JSONObject
//import cn.hutool.json.JSONUtil
//import cn.hutool.log.StaticLog
//import com.parsec.aika.content.ContentServiceApplicationTests
//import org.junit.jupiter.api.Test
//import org.springframework.beans.factory.annotation.Autowired
//
//class GptClientTest : ContentServiceApplicationTests() {
//
//    @Autowired
//    private lateinit var gptClient: GptClient
//
////    @Test
//    fun getJson() {
//        val json = """
//			{"id":"chatcmpl-9ZD0MgYKl7PQf94FerYnf0B906lml","object":"chat.completion","created":1718178498,"model":"gpt-4o-2024-05-13","choices":[{"index":0,"message":{"role":"assistant","content":"{\"key:73r5kufvkg800000000\":true,\"key:wtxnmjn2dhc0000000\":true,\"key:ts7zpbhg6cg00000000\":true,\"key:9cckduwlkfs00000000\":false,\"key:24i13yvsc8lc0000000\":true,\"key:5ih4ywxm6nw00000000\":true,\"key:io59w5r094o00000000\":true,\"key:7yt66ls4fgo00000000\":false,\"key:e1qmj3qmq3400000000\":false,\"key:479qt9l4vc8000000\":false,\"key:1e71t5klmlq80000000\":false,\"key:qmdxwpapswg0000000\":false,\"key:4kq5q3spp9q00000000\":false,\"key:3ecsheaskiq00000000\":false,\"key:7zdgb7tpku400000000\":true,\"key:53u52krurqk00000000\":true,\"key:b8heatvfz2g00000000\":true,\"key:58ds33z2v2c00000000\":false,\"key:50vm34avczo00000000\":false,\"answer\":\"Иногда сложно понять, с чего начать. Думаю, важно принять себя, а потом уже работать над улучшениями.\"\""},"logprobs":null,"finish_reason":"stop"}],"usage":{"prompt_tokens":2174,"completion_tokens":309,"total_tokens":2483},"system_fingerprint":"fp_319be4768e"}
//		""".trimIndent()
//
//        val jsonObject = JSONObject(json)
//        val error = jsonObject.getStr("error")
//        Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)
//
//        val jsonArray = jsonObject.getJSONArray("choices")
//        val jsonObject1 = jsonArray.getJSONObject(0)
//        val message = jsonObject1.getJSONObject("message")
//        val content = message.getStr("content")
//        StaticLog.info("content:{}", content)
//        val jsonStr1 = gptClient.getJsonStr(content)
//        StaticLog.info(JSONObject(jsonStr1).toString())
//    }
//
////    @Test
//    fun getAnswer() {
//        var content = """
//            {"key:50vm34avczo00000000":false,"answer":"Иногда сложно понять, с чего начать. Думаю, важно принять себя, а потом уже работать над улучшениями.\"\""
//        """.trimIndent()
//        val answer = gptClient.getAnswer(content)
//        StaticLog.info(answer)
//    }
//}