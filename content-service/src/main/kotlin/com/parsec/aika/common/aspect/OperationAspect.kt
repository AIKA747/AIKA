package com.parsec.aika.common.aspect

import cn.hutool.core.text.AntPathMatcher
import cn.hutool.json.JSONConfig
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.bo.OperationLogBO
import com.parsec.aika.content.config.RabbitmqConst.OPERATION_LOG_EXCHANGE
import com.parsec.aika.content.config.RabbitmqConst.OPERATION_LOG_ROUTE_KEY
import jakarta.annotation.PostConstruct
import jakarta.annotation.Resource
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.After
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import java.time.LocalDateTime
import java.util.*

@Aspect
@Component
class OperationAspect : BaseAspect() {

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    private final val managePath = "/manage/**"

    private final val antPathMatcher = AntPathMatcher()

    @PostConstruct
    fun init() {
        StaticLog.info("OperationAspect init success")
    }

    @Pointcut("@annotation(org.springframework.web.bind.annotation.PostMapping) || @annotation(org.springframework.web.bind.annotation.PutMapping)||@annotation(org.springframework.web.bind.annotation.DeleteMapping)||@annotation(org.springframework.web.bind.annotation.PatchMapping)")
    fun optLogAspect() {
    }

    @After("optLogAspect()")
    fun after(joinPoint: JoinPoint) {
        val request = (RequestContextHolder.getRequestAttributes() as ServletRequestAttributes?)!!.request
        try {
            //是否为管理端操作
            val servletPath = request.servletPath
            if (!antPathMatcher.match(managePath, servletPath)) {
                return
            }
            val loginUser = this.getLoginUser(joinPoint, request)
            if (Objects.isNull(loginUser)) {
                return
            }
            val finalValue = this.getRequestParams(joinPoint)
            val operationLogBO = OperationLogBO().apply {
                this.adminId = loginUser!!.userId
                this.adminName = loginUser.username
                this.ip = request.remoteHost
                this.path = request.servletPath
                this.operatedTime = LocalDateTime.now()
                this.action = request.method
                this.finalValue = finalValue
                this.module = request.contextPath.replace("/", "")
                this.record = joinPoint.signature.name
            }
            val msg = JSONUtil.toJsonStr(operationLogBO, JSONConfig())
            StaticLog.info("operationLogBO:{}", msg)
            rabbitTemplate.convertAndSend(OPERATION_LOG_EXCHANGE, OPERATION_LOG_ROUTE_KEY, msg)
        } catch (e: Exception) {
            StaticLog.error("record admin opt fail,{}", e);
        }
    }

}