package com.parsec.aika.order.service

interface TranslateService {


    fun translateLanguage(text: String?, language: String): String?

}