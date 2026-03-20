package com.parsec.aika.user.service

interface TranslateService {


    fun translateLanguage(text: String?, language: String): String?

}