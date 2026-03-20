package com.parsec.aika.common.aspect

import cn.hutool.core.util.ArrayUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.content.service.TranslateService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import com.parsec.trantor.common.response.PageResult
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.aspectj.lang.reflect.MethodSignature
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import java.util.*

@Aspect
@Component
class TranslateAspect : BaseAspect() {

    @Autowired
    private lateinit var translateService: TranslateService

    private final val defaultLanguage = "en"

    @Pointcut("execution(* com.parsec.aika.content.controller.app..*(..))")
    fun translatePoint() {
    }

    @Around("translatePoint()")
    fun translateResult(joinPoint: ProceedingJoinPoint): Any {
        val proceed = joinPoint.proceed()
        if (proceed is BaseResult<*>) {
            val request = (RequestContextHolder.getRequestAttributes() as ServletRequestAttributes?)!!.request
            val loginUser = getLoginUser(joinPoint, request)
            if (null == loginUser || StrUtil.isBlank(loginUser.language) || loginUser.language == defaultLanguage) {
                //这几种情况不翻译：1.用户信息为空；2.用户未设置语言；3.用户设置的默认语言。
                proceed.msg = translateService.translateLanguage(proceed.msg, defaultLanguage)
                return proceed
            }
            //进行翻译
            proceed.msg = translateService.translateLanguage(proceed.msg, loginUser.language!!)
            //如果成功
            if (proceed.code == BaseResultCode.SUCCESS.code()) {
                val data = proceed.data
                if (Objects.isNull(data)) {
                    return proceed
                }
                //更新对象属性
                this.modifyData(data, loginUser.language!!, joinPoint)
            }
        }
        return proceed
    }

    /**
     * 更新对象属性
     */
    private fun modifyData(data: Any, language: String, joinPoint: ProceedingJoinPoint) {
        //处理集合数据
        if (data is Collection<*>) {
            //判断是否需要翻译
            val signature = joinPoint.signature as MethodSignature
            val translateResult: TranslateResult? = signature.method.getAnnotation(TranslateResult::class.java)
            if (null != translateResult) {
                //如果是集合则跳过翻译
                data.filterNotNull().forEach {
                    if (it is String) {
                        translateService.translateLanguage(it, language)
                    } else {
                        //获取是否有翻译的注解，如果标记了需要翻译则翻译
                        val translateAnnotation = it.javaClass.getAnnotation(Translate::class.java)
                        if (null != translateAnnotation && ArrayUtil.isNotEmpty(translateAnnotation.fields)) {
                            //对注解标记的字段进行翻译
                            val fields = translateAnnotation.fields
                            this.modifyProperties(it, fields, language)
                        }
                    }
                }
            }
        } else if (data is PageResult<*>) {
            //判断是否需要翻译
            val signature = joinPoint.signature as MethodSignature
            val translateResult: TranslateResult? = signature.method.getAnnotation(TranslateResult::class.java)
            if (null != translateResult) {
                data.list = data.list.map {
                    if (it is String) {
                        return@map translateService.translateLanguage(it, language)
                    } else {
                        //获取是否有翻译的注解，如果标记了需要翻译则翻译
                        val translateAnnotation = it.javaClass.getAnnotation(Translate::class.java)
                        if (null != translateAnnotation && ArrayUtil.isNotEmpty(translateAnnotation.fields)) {
                            //对注解标记的字段进行翻译
                            val fields = translateAnnotation.fields
                            this.modifyProperties(it, fields, language)
                        }
                        return@map it
                    }
                }.toList()
            }
        } else {
            //获取是否有翻译的注解，如果标记了需要翻译则翻译
            val translateAnnotation = data.javaClass.getAnnotation(Translate::class.java)
            if (null != translateAnnotation && ArrayUtil.isNotEmpty(translateAnnotation.fields)) {
                //对注解标记的字段进行翻译
                val fields = translateAnnotation.fields
                this.modifyProperties(data, fields, language)
            }
        }
    }

    /**
     * 修改对象指定属性的值
     */
    private fun modifyProperties(data: Any, fields: Array<String>, language: String) {
        StaticLog.info("data:{}", JSONUtil.toJsonStr(data))
        val dataClass = data.javaClass
        for (field in fields) {
            try {
                val field1 = dataClass.getDeclaredField(field)
                field1.isAccessible = true
                val value = field1.get(data)
                StaticLog.info("field:{},value:{}", field, value)
                when (value) {
                    is String -> {
                        //                    StaticLog.info("field:{},oldValue:{}", field, value)
                        field1.set(data, translateService.translateLanguage(value.toString(), language))
                    }

                    is List<*> -> {
                        val list = value.map {
                            if ((it is String) && StrUtil.isNotBlank(it)) {
                                translateService.translateLanguage(it, language)
                            } else {
                                it
                            }
                        }.toList()
                        field1.set(data, list)
                    }

                    else -> {
                        StaticLog.warn("不支持的数据类型,field:{},type:{}", field, field1.type.name)
                    }
                }
            } catch (e: Exception) {
                StaticLog.error("翻译字段[{}]信息异常，异常信息:{}", field, e.message)
            }
        }
    }
}

/**
 * 翻译注解
 */
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Translate(val fields: Array<String>)

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class TranslateResult
