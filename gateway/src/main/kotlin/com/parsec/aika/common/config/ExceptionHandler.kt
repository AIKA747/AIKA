package com.parsec.aika.common.config

import cn.hutool.json.JSONUtil
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.exception.core.AuthException
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.core.NestedRuntimeException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@Component
class ExceptionHandler : WebFilter {

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        return chain.filter(exchange).onErrorResume { ex ->
            // 异常处理 此处添加自定义异常处理
            val errorResult: BaseResult<*>
            if (ex is BusinessException) {
                errorResult = BaseResult.failure(ex.code, ex.message)
            } else if (ex is NestedRuntimeException) {
                errorResult = BaseResult.failure(-1, ex.message)
            } else {
                ex.printStackTrace()
                errorResult = BaseResult.failure()
            }
            val response = exchange.response
            if (ex is AuthException) {
                response.statusCode = HttpStatus.UNAUTHORIZED
            } else {
                response.statusCode = HttpStatus.BAD_REQUEST
            }
            val buffer = response.bufferFactory()
                .wrap(JSONUtil.toJsonStr(errorResult).toByteArray())
            response.writeWith(Mono.just(buffer))
        }
    }
}