package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.GetOperationLogsReq
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.admin.service.OperationLogService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageOperationLogController {

    @Resource
    private lateinit var operationLogService: OperationLogService

    /**
     * 操作日志分页查询
     */
    @GetMapping("/operation-logs")
    fun getOperationLogs(req: GetOperationLogsReq, loginUserInfo: LoginUserInfo): BaseResult<PageResult<GetOperationLogsResp>> {
        return BaseResult.success(operationLogService.getOperationLogs(req, loginUserInfo))
    }

}