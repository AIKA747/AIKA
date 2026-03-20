package com.parsec.aika.user.service

import java.io.File

interface NsfwService {

    /**
     * 文件内容校验
     */
    fun contentCheck(file: File): Double
}