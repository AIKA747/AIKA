package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.GetEmailLogsReq
import com.parsec.aika.admin.model.vo.req.GetOperationLogsReq
import com.parsec.aika.admin.model.vo.req.GetSmsLogsReq
import com.parsec.aika.admin.model.vo.resp.GetEmailLogsResp
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.admin.model.vo.resp.GetSmsLogsResp
import com.parsec.aika.admin.service.EmailLogService
import com.parsec.aika.admin.service.OperationLogService
import com.parsec.aika.admin.service.SmsLogService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageEmailLogController {

    @Resource
    private lateinit var emailLogService: EmailLogService

    /**
     * 邮箱日志分页查询
     */
    @GetMapping("/email-logs")
    fun getEmailLogs(req: GetEmailLogsReq, loginUserInfo: LoginUserInfo): BaseResult<PageResult<GetEmailLogsResp>> {
        return BaseResult.success(emailLogService.getEmailLogs(req, loginUserInfo))
    }

}