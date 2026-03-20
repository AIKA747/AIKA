package com.parsec.aika.user.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class TranslateServiceTest {

    @Autowired
    private lateinit var translateService: TranslateService

//    @Test
    fun translate() {
        assert("Dancing"==translateService.translateLanguage("跳舞", "en"))
        assert("Crafting"==translateService.translateLanguage("手作り", "en"))
        assert("音楽"==translateService.translateLanguage("음악", "ja"))
        assert("영화 보기"==translateService.translateLanguage("看电影", "ko"))
    }


}