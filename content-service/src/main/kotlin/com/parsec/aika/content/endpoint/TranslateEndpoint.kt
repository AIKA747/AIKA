package com.parsec.aika.content.endpoint

import com.parsec.aika.content.service.TranslateService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TranslateEndpoint {

    @Autowired
    private lateinit var translateService: TranslateService

    @GetMapping("/feign/translate")
    fun translateLanguage(text: String, language: String): String? {
        return translateService.translateLanguage(text, language)
    }

}