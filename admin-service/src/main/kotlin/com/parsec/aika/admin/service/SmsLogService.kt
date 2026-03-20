package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.req.GetOperationLogsReq
import com.parsec.aika.admin.model.vo.req.GetSmsLogsReq
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.admin.model.vo.resp.GetSmsLogsResp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult


interface SmsLogService {
    fun getSmsLogs(req: GetSmsLogsReq, loginUserInfo: LoginUserInfo): PageResult<GetSmsLogsResp>
}