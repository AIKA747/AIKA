package com.parsec.aika.content.service.impl

import cn.hutool.core.util.StrUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.content.gpt.ChatMessage
import com.parsec.aika.content.gpt.GptClient
import com.parsec.aika.content.service.TranslateMapResourceService
import com.parsec.aika.content.service.TranslateService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

@RefreshScope
@Service
class TranslateServiceImpl : TranslateService {

    @Autowired
    private lateinit var redisTemplate: StringRedisTemplate

    @Autowired
    private lateinit var translateMapResourceService: TranslateMapResourceService

    @Autowired
    private lateinit var gptClient: GptClient

    @Value("\${spring.profiles.active:}")
    private var env: String? = null

    override fun translateLanguage(text: String?, language: String): String? {
        if (StrUtil.isBlank(text)) {
            return text
        }
        val key = "translate:language:${language}"
        var value = text
        val opsForHash = redisTemplate.opsForHash<String, String>()
        if (opsForHash.hasKey(key, text!!)) {
            return opsForHash.get(key, text).toString()
        }
        val mapValue = translateMapResourceService.getTranslateMapResouce(text!!, language)
        if (StrUtil.isNotBlank(mapValue)) {
            return mapValue
        }
        if (env == "testci") {
            return text
        }
        try {
            // 构建消息列表
            val messages = listOf(
                ChatMessage(
                    "user",
                    "Please translate the following text into the specified ISO 639-1 language code $language and return only the translated text: $text"
                )
            )
            value = gptClient.send(
                "You are a translator proficient in multiple languages.", false, chatmessages = messages
            )
            StaticLog.info("TranslateServiceImpl.translateLanguage resp:{}", value)
            opsForHash.put(key, text, value)
        } catch (e: Exception) {
            StaticLog.error(e)
        }
        return value
    }

}