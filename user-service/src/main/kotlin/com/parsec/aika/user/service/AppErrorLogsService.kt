package com.parsec.aika.user.service

import com.parsec.aika.user.model.vo.req.AppErrorLogsReq

interface AppErrorLogsService {
    fun uploadAppErrorLog(req: AppErrorLogsReq): String
}