package com.parsec.aika.common.aspect

import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.aspectj.lang.JoinPoint
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.multipart.MultipartFile
import java.net.URLDecoder
import java.util.*
import javax.servlet.http.HttpServletRequest

open class BaseAspect {

    @Autowired
    protected lateinit var objectMapper: ObjectMapper

    fun getLoginUser(joinPoint: JoinPoint, request: HttpServletRequest): LoginUserInfo? {
        try {
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
                    return null
                }
            }
            val language = request.getHeader("X-Language")
            if (StrUtil.isNotBlank(language)) {
                loginUser!!.language = language
            }
            return loginUser
        } catch (e: Exception) {
            StaticLog.error("获取当前登录用户信息出现异常，异常信息：{}", e.message)
            return null
        }
    }

    fun getLoginUser(joinPoint: JoinPoint): LoginUserInfo? {
        val args = filterMethodArgs(joinPoint)
        return args.firstOrNull {
            it is LoginUserInfo
        } as LoginUserInfo?
    }

    fun getRequestParams(joinPoint: JoinPoint): String {
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
    }
}