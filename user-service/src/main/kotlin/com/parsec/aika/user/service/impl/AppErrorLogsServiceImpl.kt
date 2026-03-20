package com.parsec.aika.user.service.impl

import com.parsec.aika.user.mapper.AppErrorLogsMapper
import com.parsec.aika.user.model.entity.AppErrorLogs
import com.parsec.aika.user.model.vo.req.AppErrorLogsReq
import com.parsec.aika.user.service.AppErrorLogsService
import com.parsec.aika.user.service.FileUploadService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AppErrorLogsServiceImpl : AppErrorLogsService {

    @Autowired
    private lateinit var fileUploadService: FileUploadService

    @Autowired
    private lateinit var appErrorLogsMapper: AppErrorLogsMapper

    override fun uploadAppErrorLog(req: AppErrorLogsReq): String {
        val logUrl = fileUploadService.uploadFile(req.file!!, "logs")
        appErrorLogsMapper.insert(AppErrorLogs().apply {
            this.userId = req.userId
            this.device = req.device
            this.systemVersion = req.systemVersion
            this.remark = req.remark
            this.logFileUrl = logUrl
        })
        return logUrl
    }
}