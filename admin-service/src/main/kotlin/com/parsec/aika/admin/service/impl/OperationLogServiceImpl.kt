package com.parsec.aika.admin.service.impl

import cn.hutool.core.bean.BeanUtil
import com.github.pagehelper.PageHelper
import com.parsec.aika.admin.model.vo.req.GetOperationLogsReq
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.admin.service.OperationLogService
import com.parsec.aika.common.mapper.OperationLogMapper
import com.parsec.aika.common.model.bo.OperationLogBO
import com.parsec.aika.common.model.entity.OperationLog
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.Resource


@Service
class OperationLogServiceImpl : OperationLogService {

    @Resource
    private lateinit var operationLogMapper: OperationLogMapper

    /**
     * 操作日志分页查询
     */
    override fun getOperationLogs(
        req: GetOperationLogsReq, loginUserInfo: LoginUserInfo
    ): PageResult<GetOperationLogsResp> {
        PageHelper.startPage<GetOperationLogsResp>(req.pageNo!!, req.pageSize!!)
        return PageUtil<GetOperationLogsResp>().page(operationLogMapper.getOperationLogs(req))
    }

    override fun operationLogSave(operationLogBO: OperationLogBO) {
        val operationLog = BeanUtil.copyProperties(operationLogBO, OperationLog::class.java)
        operationLog.createdAt= LocalDateTime.now()
        operationLog.updatedAt= LocalDateTime.now()
        operationLogMapper.insert(operationLog)
    }

}