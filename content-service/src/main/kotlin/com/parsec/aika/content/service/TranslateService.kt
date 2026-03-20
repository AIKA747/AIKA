package com.parsec.aika.content.service

interface TranslateService {

    fun translateLanguage(text: String?, language: String): String?

}