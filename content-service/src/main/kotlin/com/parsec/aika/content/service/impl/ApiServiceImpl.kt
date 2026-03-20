package com.parsec.aika.content.service.impl

import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.parsec.aika.common.model.vo.resp.ApiEstimatedWeightResp
import com.parsec.aika.common.model.vo.resp.ApiTranslateResp
import com.parsec.aika.content.gpt.OpenaiRestHandler
import com.parsec.aika.content.service.ApiService
import com.parsec.aika.content.service.EstimatedWeightService
import com.parsec.aika.content.service.TranslateService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.context.config.annotation.RefreshScope
import org.springframework.stereotype.Service

@RefreshScope
@Service
class ApiServiceImpl : ApiService {

    @Autowired
    private lateinit var translateService: TranslateService

    @Autowired
    private lateinit var estimatedWeightService: EstimatedWeightService

    @Autowired
    private lateinit var openaiRestHandler: OpenaiRestHandler

    @Value("\${openai.chatgpt.url:https://api.openai.com/v1/chat/completions}")
    private val gptUrl: String? = null


    override fun translate(text: String, language: String): ApiTranslateResp? {
        val translate = translateService.translateLanguage(text, language)
        StaticLog.info("ApiServiceImpl.translate：{}", translate)
        return ApiTranslateResp().apply { translation = translate }
    }

    override fun estimatedWeight(productDescription: String?): ApiEstimatedWeightResp? {
        val jsonObject = estimatedWeightService.estimatedWeight(productDescription)
        StaticLog.info("ApiServiceImpl.jsonObject：{}", jsonObject)
        return JSONUtil.toBean(jsonObject, ApiEstimatedWeightResp::class.java)
    }

    override fun umayOpenai(body: String): String? {
        return openaiRestHandler.doPost(
            gptUrl!!, body
        )
    }
}
