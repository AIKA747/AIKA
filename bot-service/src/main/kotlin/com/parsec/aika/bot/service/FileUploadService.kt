package com.parsec.aika.bot.service

import org.springframework.web.multipart.MultipartFile
import java.io.File

interface FileUploadService {


    fun uploadFile(file: MultipartFile, prefix: String?): String

    fun uploadFile(file: File, prefix: String?): String
    fun uploadFile(audioData: ByteArray, subfix: String, contentType: String?, prefix: String?): String
    fun uploadFile(fileUrl: String, subfix: String, contentType: String?, prefix: String?): String
}