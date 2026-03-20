package com.parsec.aika.user.service.impl

import cn.hutool.core.io.FileUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONArray
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.user.remote.ContentFeignClient
import com.parsec.aika.user.service.TranslateService
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct
import javax.annotation.Resource

@Service
class TranslateServiceImpl : TranslateService {

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    @Resource
    private lateinit var contentFeignClient: ContentFeignClient

    private var TRANSLATE_JSON = JSONArray()

    @PostConstruct
    fun init() {
        try {
            StaticLog.info("=========开始初始化静态翻译文件=========")
            val file = FileUtil.file("/app/translate.json")
            if (!file.exists()) {
                StaticLog.warn("=========静态翻译文件未找到=========")
                return
            }
            TRANSLATE_JSON = JSONUtil.readJSONArray(file, Charsets.UTF_8)
            StaticLog.info("=========初始化静态翻译文件完成=========")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun translateStatic(text: String?, language: String): String? {
        val optional = TRANSLATE_JSON.stream().map { JSONObject(it) }.filter {
            it.values.contains(text)
        }.map { it.getStr(language) }.findFirst()
        return if (optional.isPresent) {
            optional.get()
        } else {
            null
        }
    }

    override fun translateLanguage(text: String?, language: String): String? {
        if (StrUtil.isBlank(text)) {
            return text
        }
        val staticTranslate = translateStatic(text, language)
        if (null != staticTranslate) {
            return staticTranslate
        }
        val redisKey = "translate:language:$language"
        val opsForHash = stringRedisTemplate.opsForHash<String, String?>()
        if (opsForHash.hasKey(redisKey, text!!)) {
            return opsForHash.get(redisKey, text).toString()
        }
        return contentFeignClient.translateLanguage(text, language)
    }


}