package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.GetOperationLogsReq
import com.parsec.aika.admin.model.vo.req.GetSmsLogsReq
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.admin.model.vo.resp.GetSmsLogsResp
import com.parsec.aika.admin.service.OperationLogService
import com.parsec.aika.admin.service.SmsLogService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageSmsLogController {

    @Resource
    private lateinit var smsLogService: SmsLogService

    /**
     * 短信日志分页查询
     */
    @GetMapping("/sms-logs")
    fun getSmsLogs(req: GetSmsLogsReq, loginUserInfo: LoginUserInfo): BaseResult<PageResult<GetSmsLogsResp>> {
        return BaseResult.success(smsLogService.getSmsLogs(req, loginUserInfo))
    }

}