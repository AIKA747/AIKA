package com.parsec.aika.bot.service

interface TranslateService {


    fun translateLanguage(text: String?, language: String): String?

}