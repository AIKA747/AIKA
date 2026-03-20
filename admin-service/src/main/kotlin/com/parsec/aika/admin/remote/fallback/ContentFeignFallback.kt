package com.parsec.aika.admin.remote.fallback

import cn.hutool.log.StaticLog
import com.parsec.aika.admin.remote.ContentFeignClient
import org.springframework.stereotype.Component

@Component
class ContentFeignFallback : ContentFeignClient {
    override fun translateLanguage(text: String, language: String): String? {
        StaticLog.error("翻译文本异常.....,language:${language},text：$text")
        return text
    }
}