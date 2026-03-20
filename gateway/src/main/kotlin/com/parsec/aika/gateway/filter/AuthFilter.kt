package com.parsec.aika.gateway.filter

import cn.hutool.core.date.LocalDateTimeUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.http.HttpUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.jwt.JWTUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.constant.RedisCont
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.gateway.props.GatewayProps
import com.parsec.trantor.common.response.BaseResultCode
import com.parsec.trantor.exception.core.AuthException
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.core.Ordered
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Component
import org.springframework.util.AntPathMatcher
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.net.URLEncoder
import java.nio.charset.Charset
import java.time.LocalDateTime
import java.util.*
import javax.annotation.PostConstruct

@Component
class AuthFilter : GlobalFilter, Ordered {

    @Autowired
    private lateinit var gatewayProps: GatewayProps

    @Autowired
    private lateinit var stringRedisTemplate: StringRedisTemplate

    private val matcher = AntPathMatcher()

    private val TOKEN_HEADER: String = "Authorization"

    private final val SUPPER_ADMIN_ID = "1000000"

    private val notFilterPaths = ArrayList<String>()

    private val appUserUrl = "/*/app/**"
    private val manageUserUrl = "/*/manage/**"
    private val adminUserUrl = "/admin/**"

    @PostConstruct
    fun init() {
        //不拦截公共资源
        notFilterPaths.add("/*/public/**")
        notFilterPaths.add("/*/test/**")
        //不拦截emqx认证鉴权接口
        notFilterPaths.add("/chat/emqx/conn/auth")
        notFilterPaths.add("/chat/emqx/topic/auth")

        StaticLog.info("AuthFilter init success!!")
    }

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        if (gatewayProps.systemSwitch == true) {
            throw BusinessException(
                7001, gatewayProps.systemMessage ?: "System maintenance in progress, please try again later"
            )
        }
        // 获取请求地址
        val pathContainer = exchange.request.path.pathWithinApplication()
        val clientHost = exchange.request.remoteAddress!!.hostString
        val path = pathContainer.toString()
        StaticLog.info("clent host:{},访问请求路径：{}", clientHost, path)
        val token = getToken(exchange)
        if (checkPath(path, notFilterPaths)) {
            if (StrUtil.isNotBlank(token)) {
                try {
                    val jwt = JWTUtil.parseToken(token)
                    val req = exchange.request.mutate().headers {
                        it.add("userInfo", URLEncoder.encode(jwt.payload.toString(), "UTF-8"))
                    }.build()
                    return chain.filter(exchange.mutate().request(req).build())
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
            // 无需限制的地址,继续执行
            return chain.filter(exchange)
        }
        //其他路径拦截
        if (!matcher.match(appUserUrl, path) && !matcher.match(manageUserUrl, path) && !matcher.match(
                adminUserUrl, path
            )
        ) {
            throw AuthException(BaseResultCode.PERMISSION_NO_ACCESS)
        }
        if (StrUtil.isEmpty(token)) {
            throw AuthException(BaseResultCode.USER_NOT_LOGGED_IN)
        }
        //验证token令牌
        try {
            if (!JWTUtil.verify(token, gatewayProps.jwtKey?.toByteArray())) {
                throw AuthException(BaseResultCode.TOKEN_EXPIRATION)
            }
        } catch (e: Exception) {
            throw AuthException(BaseResultCode.TOKEN_EXPIRATION)
        }
        val jwt = JWTUtil.parseToken(token).setKey(gatewayProps.jwtKey?.toByteArray())
        if (!jwt.verify()) {
            throw AuthException(BaseResultCode.PERMISSION_NO_ACCESS)
        }
        val payloads = jwt.payloads
        StaticLog.info("payloads:{}", payloads.toString())
        //app用户校验
        if (matcher.match(appUserUrl, path)) {
            if (payloads.getStr("userType") != UserTypeEnum.APPUSER.name) {
                throw AuthException(BaseResultCode.PERMISSION_NO_ACCESS)
            }
            checkToken(token!!, payloads, UserTypeEnum.APPUSER)
        }
        //管理员校验
        if (matcher.match(manageUserUrl, path) || matcher.match(adminUserUrl, path)) {
            val userId = payloads.getStr("userId")
            this.checkUserStatus(userId)
            if (payloads.getStr("userType") != UserTypeEnum.ADMINUSER.name) {
                throw AuthException(BaseResultCode.PERMISSION_NO_ACCESS)
            }
            if (userId != SUPPER_ADMIN_ID) {
                this.checkUserPermissions(payloads.getStr("roleId"), path)
            }
        }
        val req: ServerHttpRequest = exchange.request.mutate().headers {
            it.add("userInfo", URLEncoder.encode(payloads.toString(), "UTF-8"))
        }.build()

        return chain.filter(exchange.mutate().request(req).build())
    }

    private fun checkUserPermissions(roleId: String, path: String) {
        if (StrUtil.isBlank(roleId)) {
            throw AuthException(BaseResultCode.TOKEN_EXPIRATION)
        }
        val paths = stringRedisTemplate.opsForValue().get("""${RedisCont.ROLE_RESOURCE_PATHS}$roleId""")
        if (StrUtil.isBlank(paths) || !checkPath(path, paths!!.split(","))) {
            throw AuthException(BaseResultCode.PERMISSION_NO_ACCESS)
        }
    }

    private fun getToken(exchange: ServerWebExchange): String? {
        // 获取token
        val headers = exchange.request.headers[TOKEN_HEADER]
        val token = if (headers != null) headers[0] else HttpUtil.decodeParamMap(
            exchange.request.uri.toString(), Charset.defaultCharset()
        )["token"]
        StaticLog.info("token:{}", token)
        return token
    }


    private fun checkToken(token: String, payloads: JSONObject, userTypeEnum: UserTypeEnum) {
        //查询用户token状态
//        val entries = RedisUtil.hmget("""${RedisCont.USER_INFO}${payloads.getStr("userId")}""")
        val entries = stringRedisTemplate.opsForHash<String, String>()
            .entries("""${RedisCont.USER_INFO}${payloads.getStr("userId")}""")
        val userStatus = entries["status"]
        if (userStatus == UserStatus.disabled.name) {
            throw AuthException(BaseResultCode.USER_ACCOUNT_FORBIDDEN)
        }
        val tokenSigner = getSigner(token)
        val cacheTokenSigner = entries["${userTypeEnum.name}:tokenSigner"]
        if (tokenSigner != cacheTokenSigner) {
            //判断是否是之前的旧token
            var flag = true
            val oldTokerSigner = entries["oldTokerSigner"]
            if (null != oldTokerSigner && tokenSigner == oldTokerSigner) {
                //获取旧token的有效时间
                val oldTokerSignerExpireAtObj = entries["oldTokerSignerExpireAt"]
                if (null != oldTokerSignerExpireAtObj) {
                    val oldTokerSignerExpireAt =
                        LocalDateTimeUtil.parse(oldTokerSignerExpireAtObj.toString(), "yyyy-MM-dd HH:mm:ss")
                    //判断是否过期
                    if (oldTokerSignerExpireAt.isAfter(LocalDateTime.now())) {
                        flag = false
                        //标记为旧token，旧token不能覆盖新token
                        payloads.set("oldToken", true)
                    }
                }
            }
            if (flag) {
                throw AuthException(BaseResultCode.TOKEN_EXPIRATION)
            }
        }
    }

    private fun checkUserStatus(userId: String) {
        val userStatus =
            stringRedisTemplate.opsForHash<String?, String?>().get("""${RedisCont.USER_INFO}${userId}""", "status")
        if (userStatus == UserStatus.disabled.name) {
            throw AuthException(BaseResultCode.USER_ACCOUNT_FORBIDDEN)
        }
    }

    /**
     * 获取token签名
     */
    private fun getSigner(token: String): String {
        return token.split(".")[2]
    }


    /**
     * 校验路径是否需要验证token
     *
     * @param path
     * @return true:通过；false不通过
     */
    private fun checkPath(path: String, paths: List<String>): Boolean {
        StaticLog.debug("校验的路径:{}", JSONUtil.toJsonStr(paths))
        return Optional.ofNullable(paths).orElseGet { ArrayList() }.parallelStream()
            .anyMatch { v: String? -> matcher.match(v!!, path) }
    }

    override fun getOrder(): Int {
        return 1
    }
}
