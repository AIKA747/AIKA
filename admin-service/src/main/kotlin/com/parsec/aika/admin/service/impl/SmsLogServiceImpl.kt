package com.parsec.aika.admin.service.impl

import com.github.pagehelper.PageHelper
import com.parsec.aika.admin.model.vo.req.GetSmsLogsReq
import com.parsec.aika.admin.model.vo.resp.GetSmsLogsResp
import com.parsec.aika.admin.service.SmsLogService
import com.parsec.aika.common.mapper.SmsLogMapper
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import javax.annotation.Resource


@Service
class SmsLogServiceImpl : SmsLogService {

    @Resource
    private lateinit var smsLogMapper: SmsLogMapper

    /**
     * 短信日志分页查询
     */
    override fun getSmsLogs(req: GetSmsLogsReq, loginUserInfo: LoginUserInfo): PageResult<GetSmsLogsResp> {
        PageHelper.startPage<GetSmsLogsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetSmsLogsResp>().page(smsLogMapper.getSmsLogs(req))
    }

}