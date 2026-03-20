package com.parsec.aika.admin.service.impl

import com.github.pagehelper.PageHelper
import com.parsec.aika.admin.model.vo.req.GetEmailLogsReq
import com.parsec.aika.admin.model.vo.resp.GetEmailLogsResp
import com.parsec.aika.admin.service.EmailLogService
import com.parsec.aika.common.mapper.EmailLogMapper
import com.parsec.aika.common.model.bo.EmailLogBO
import com.parsec.aika.common.model.entity.EmailLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource


@Service
class EmailLogServiceImpl : EmailLogService {

    @Resource
    private lateinit var emailLogMapper: EmailLogMapper

    /**
     * 邮箱日志分页查询
     */
    override fun getEmailLogs(req: GetEmailLogsReq, loginUserInfo: LoginUserInfo): PageResult<GetEmailLogsResp> {
        PageHelper.startPage<GetEmailLogsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetEmailLogsResp>().page(emailLogMapper.getEmailLogs(req))
    }

    override fun emailLogSave(emailLogBO: EmailLogBO) {
        val emailLogVo = EmailLog().apply {
            this.email = emailLogBO.email
            this.subject = emailLogBO.subject
            this.content = emailLogBO.content
            this.sendTime = emailLogBO.sendTime
            this.status = emailLogBO.status
            this.createdAt = LocalDateTime.now()
            this.updatedAt = LocalDateTime.now()
            this.deleted = false
        }
        emailLogMapper.insert(emailLogVo)
    }

}