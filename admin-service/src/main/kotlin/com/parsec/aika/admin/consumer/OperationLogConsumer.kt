package com.parsec.aika.admin.consumer

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.admin.config.RabbitmqConst
import com.parsec.aika.admin.service.OperationLogService
import com.parsec.aika.common.model.bo.OperationLogBO
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component
import java.util.*
import javax.annotation.Resource

@Component
class OperationLogConsumer {

    @Resource
    private lateinit var operationLogService: OperationLogService

    @RabbitHandler
    @RabbitListener(queues = [RabbitmqConst.OPERATION_LOG_QUEUE])
    fun operationLogReceiver(msg: String) {
        try {
            StaticLog.info("${RabbitmqConst.OPERATION_LOG_QUEUE},收到操作日志存储信息：{}", msg)
            val operationLogBO = JSONUtil.toBean(msg, OperationLogBO::class.java)
            StaticLog.info("operationLogBO:{}", JSONUtil.toJsonStr(operationLogBO))
            if (Objects.nonNull(operationLogBO)) {
                operationLogService.operationLogSave(operationLogBO)
            }
        } catch (e: Exception) {
            StaticLog.error("处理邮件发送日志异常")
            e.printStackTrace()
        }
    }

}