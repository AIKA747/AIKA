package com.parsec.aika.bot.service.impl

import cn.hutool.core.util.StrUtil
import com.parsec.aika.bot.remote.ContentFeignClient
import com.parsec.aika.bot.service.TranslateService
import com.parsec.trantor.redis.util.RedisUtil
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class TranslateServiceImpl : TranslateService {

    @Resource
    private lateinit var contentFeignClient: ContentFeignClient

    override fun translateLanguage(text: String?, language: String): String? {
        if (StrUtil.isBlank(text)) {
            return text
        }
        val redisKey = "translate:language:$language"
        if (RedisUtil.hHasKey(redisKey, text)) {
            return RedisUtil.hget(redisKey, text).toString()
        }
        return contentFeignClient.translateLanguage(text!!, language)
    }


}