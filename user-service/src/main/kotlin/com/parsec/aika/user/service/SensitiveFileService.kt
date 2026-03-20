package com.parsec.aika.user.service

import com.parsec.aika.user.model.entity.SensitiveFile

interface SensitiveFileService {
    fun save(sensitiveFile: SensitiveFile)
}