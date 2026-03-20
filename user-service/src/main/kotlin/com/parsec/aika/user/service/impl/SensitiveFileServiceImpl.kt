package com.parsec.aika.user.service.impl

import com.parsec.aika.user.mapper.SensitiveFileMapper
import com.parsec.aika.user.model.entity.SensitiveFile
import com.parsec.aika.user.service.SensitiveFileService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class SensitiveFileServiceImpl : SensitiveFileService {

    @Autowired
    private lateinit var sensitiveFileMapper: SensitiveFileMapper

    override fun save(sensitiveFile: SensitiveFile) {
        sensitiveFileMapper.insert(sensitiveFile)
    }
}