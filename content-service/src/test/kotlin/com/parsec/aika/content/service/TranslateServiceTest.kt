//package com.parsec.aika.content.service
//
//import cn.hutool.core.lang.Assert
//import cn.hutool.json.JSONObject
//import cn.hutool.json.JSONUtil
//import cn.hutool.log.StaticLog
//import com.fasterxml.jackson.databind.ObjectMapper
//import com.parsec.aika.content.ContentServiceApplicationTests
//import org.junit.jupiter.api.Test
//import org.springframework.beans.factory.annotation.Autowired
//
//class TranslateServiceTest : ContentServiceApplicationTests() {
//
//    @Autowired
//    private lateinit var translateService: TranslateService
//
//    @Autowired
//    private lateinit var objectMapper: ObjectMapper
//
////        @Test
//    fun translateLanguage() {
//        val text = "test1"
//        val translate1 = translateService.translateLanguage(text, "ko")
//        StaticLog.info("ko:{}", translate1)
//        val translate2 = translateService.translateLanguage(text, "en")
//        StaticLog.info("en:{}", translate2)
////        val translate3 = translateService.translate(text, "CN")
////        StaticLog.info("CN:{}", translate3)
//    }
//
//    //    @Test
//    fun jsonTest() {
//        var postResp = """
//            {
//              "id": "chatcmpl-9D01rcpO1iZoe4hqKXBI2Y4Zqe60M",
//              "object": "chat.completion",
//              "created": 1712885403,
//              "model": "gpt-3.5-turbo-0125",
//              "choices": [
//                {
//                  "index": 0,
//                  "message": {
//                    "role": "assistant",
//                    "content": "{\"translation\":\"1. 你需要帮助阿黛尔重建他的自信，尽管他经历了一次打击他信心的公开挫折。\n2. 让阿黛尔意识到来自亲人、父母和亲戚的支持有时可能是虚幻的，会导致失望。\n3. 帮助阿黛尔克服心理创伤，不让过去的经历阻止他尝试自我改进。\",\"language\":\"zh\"}"
//                  },
//                  "logprobs": null,
//                  "finish_reason": "stop"
//                }
//              ],
//              "usage": {
//                "prompt_tokens": 196,
//                "completion_tokens": 142,
//                "total_tokens": 338
//              },
//              "system_fingerprint": "fp_c2295e73ad"
//            }
//
//        """.trimIndent()
//        StaticLog.info("postResp:{}", postResp)
//        val jsonObject = JSONObject(postResp)
//        val error = jsonObject.getStr("error")
//        Assert.isNull(error, "chatgpt消息异常，异常信息：{}", error)
//
//        val message = JSONUtil.getByPath(jsonObject, "choices[0].message", "{}")
//
//        val replaceMsg = message.replace("""\n""", """\\n""").replace("""\r""", """\\r""")
//        StaticLog.info("replaceMsg:{}", replaceMsg)
//        val jsonObject1 = JSONObject(replaceMsg)
//
//        val content = jsonObject1.getStr("content")
//        val replaceContent = content.replace("""\n""", """\\n""").replace("""\r""", """\\r""")
//        StaticLog.info("replaceContent:{}", replaceContent)
//
//        val translation = JSONObject(replaceContent).getStr("translation", "")
//        StaticLog.info("translation:{}", translation)
//    }
//
//
//}