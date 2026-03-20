package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.req.GetOperationLogsReq
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.common.model.bo.OperationLogBO
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult


interface OperationLogService {
    fun getOperationLogs(req: GetOperationLogsReq, loginUserInfo: LoginUserInfo): PageResult<GetOperationLogsResp>
    fun operationLogSave(operationLogBO: OperationLogBO)
}