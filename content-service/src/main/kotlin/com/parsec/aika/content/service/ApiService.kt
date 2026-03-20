package com.parsec.aika.content.service

import com.parsec.aika.common.model.vo.resp.ApiEstimatedWeightResp
import com.parsec.aika.common.model.vo.resp.ApiTranslateResp

interface ApiService {
    /**
     * 翻译
     */
    fun translate(text: String, language: String): ApiTranslateResp?

    /**
     * 预估重量
     */
    fun estimatedWeight(productDescription: String?): ApiEstimatedWeightResp?

    /**
     * 代理调用
     */
    fun umayOpenai(body: String): String?
}
