package com.parsec.aika.admin.service

interface TranslateService {


    fun translateLanguage(text: String?, language: String): String?

}