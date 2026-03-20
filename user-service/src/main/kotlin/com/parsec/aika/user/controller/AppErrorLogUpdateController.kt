package com.parsec.aika.user.controller

import com.parsec.aika.user.model.vo.req.AppErrorLogsReq
import com.parsec.aika.user.service.AppErrorLogsService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class AppErrorLogUpdateController {

    @Autowired
    private lateinit var appErrorLogsService: AppErrorLogsService

    @PostMapping("/public/app/error-logs/upload")
    fun uploadAppErrorLog(req: AppErrorLogsReq): BaseResult<*> {
        if (req.file!!.isEmpty) {
            return BaseResult.failure("The log file cannot be empty")
        }
        return BaseResult.success(appErrorLogsService.uploadAppErrorLog(req))
    }

}