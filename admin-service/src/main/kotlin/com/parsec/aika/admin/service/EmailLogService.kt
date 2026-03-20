package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.req.GetEmailLogsReq
import com.parsec.aika.admin.model.vo.resp.GetEmailLogsResp
import com.parsec.aika.common.model.bo.EmailLogBO
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult


interface EmailLogService {

    fun getEmailLogs(req: GetEmailLogsReq, loginUserInfo: LoginUserInfo): PageResult<GetEmailLogsResp>

    /**
     * 保存邮件推送日志
     */
    fun emailLogSave(emailLogBO: EmailLogBO)

}