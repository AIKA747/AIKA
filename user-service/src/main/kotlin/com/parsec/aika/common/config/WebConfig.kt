package com.parsec.aika.common.config

import cn.hutool.core.util.StrUtil
import com.fasterxml.jackson.databind.ObjectMapper
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.client.loadbalancer.LoadBalanced
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.MethodParameter
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.client.RestTemplate
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.net.URLDecoder


@Configuration
class WebConfig : WebMvcConfigurer {

    @Autowired
    private final val argumentResolver: ArgumentResolver? = null


    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        resolvers.add(argumentResolver!!)
    }

    @LoadBalanced
    @Bean
    fun restTemplate(): RestTemplate {
        return RestTemplate()
    }


}

@Component
class ArgumentResolver : HandlerMethodArgumentResolver {

    @Autowired
    private final val objectMapper: ObjectMapper? = null

    override fun supportsParameter(parameter: MethodParameter): Boolean {
        return parameter.parameterType == LoginUserInfo::class.java
    }

    override fun resolveArgument(
        methodParameter: MethodParameter,
        mavContainer: ModelAndViewContainer?,
        nativeWebRequest: NativeWebRequest,
        binderFactory: WebDataBinderFactory?
    ): LoginUserInfo? {
        val header = nativeWebRequest.getHeader("userInfo")
        if (StrUtil.isNotBlank(header)) {
            return objectMapper?.readValue(URLDecoder.decode(header, "UTF-8"), LoginUserInfo::class.java)
        }
        return null
    }
}