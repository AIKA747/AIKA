package com.parsec.aika.common.aspect

import cn.hutool.core.text.AntPathMatcher
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONConfig
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.common.model.bo.OperationLogBO
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.config.RabbitmqConst.OPERATION_LOG_EXCHANGE
import com.parsec.aika.order.config.RabbitmqConst.OPERATION_LOG_ROUTE_KEY
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.After
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import org.springframework.web.multipart.MultipartFile
import java.net.URLDecoder
import java.time.LocalDateTime
import java.util.*
import javax.annotation.PostConstruct
import javax.annotation.Resource
import javax.servlet.http.HttpServletRequest


@Aspect
@Component
class OperationAspect {

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    @Autowired
    private lateinit var objectMapper: ObjectMapper

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
            var loginUser = this.getLoginUser(joinPoint)
            if (Objects.isNull(loginUser)) {
                val header = request.getHeader("userInfo")
                if (StrUtil.isNotBlank(header)) {
                    loginUser = objectMapper.readValue(URLDecoder.decode(header, "UTF-8"), LoginUserInfo::class.java)
                }
                if (Objects.isNull(loginUser)) {
                    StaticLog.warn(
                        "获取不到当前登录用户信息，不记录日志，[{}]访问路径：{}", request.remoteHost, request.servletPath
                    )
                    return
                }
            }
            val finalValue = this.getRequestParams(joinPoint)
            val operationLogBO = OperationLogBO().apply {
                this.adminId = loginUser!!.userId
                this.adminName = loginUser.username
                this.ip = getClientIp(request)
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

    private fun getLoginUser(joinPoint: JoinPoint): LoginUserInfo? {
        val args = filterMethodArgs(joinPoint)
        return args.firstOrNull {
            it is LoginUserInfo
        } as LoginUserInfo?
    }

    private fun getRequestParams(joinPoint: JoinPoint): String {
        val args = filterMethodArgs(joinPoint)
        return JSONUtil.toJsonStr(args)
    }


    /**
     * 获取方法参数
     *
     * @param joinPoint
     * @return
     */
    fun filterMethodArgs(joinPoint: JoinPoint): List<Any> {
        val args = joinPoint.args
        if (args == null || args.isEmpty()) {
            return ArrayList(0)
        }

        return args.filterNot {
            it is MultipartFile || it is LoginUserInfo
        }.toList()

//        return Arrays.stream(args).filter(arg ->
//        !(arg instanceof Model) && !(arg instanceof ModelMap) && !(arg instanceof BeanPropertyBindingResult) && !(arg instanceof MultipartFile))
//        .collect(Collectors.toList());
    }

    /**
     *获取客户端ip地址
     */
    fun getClientIp(request: HttpServletRequest): String {
        var ip = request.getHeader("X-Forwarded-For")
        if (ip.isNullOrBlank() || "unknown".equals(ip, ignoreCase = true)) {
            ip = request.getHeader("X-Real-IP")
        }
        if (ip.isNullOrBlank() || "unknown".equals(ip, ignoreCase = true)) {
            ip = request.remoteHost
        }
        // 如果存在多个代理，取第一个 IP 作为客户端真实 IP
        if (!ip.isNullOrBlank() && ip.contains(",")) {
            ip = ip.split(",")[0].trim()
        }
        return ip ?: "unknown"
    }
}