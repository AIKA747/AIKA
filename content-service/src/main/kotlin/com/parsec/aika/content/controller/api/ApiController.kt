package com.parsec.aika.content.controller.api

import cn.hutool.core.lang.Assert
import com.parsec.aika.common.model.entity.Story
import com.parsec.aika.common.util.SignatureUtil
import com.parsec.aika.content.service.ApiService
import com.parsec.aika.content.service.StoryService
import com.parsec.aika.content.service.TranslateMapResourceService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
class ApiController {

    @Autowired
    private lateinit var apiService: ApiService

    @Value("\${api.key:4c72e95e97c0419f80a8bd70824dc34f}")
    private lateinit var apiKey: String

    @Autowired
    private lateinit var translateMapResourceService: TranslateMapResourceService

    @Autowired
    private lateinit var storyService: StoryService


    @PostMapping("/public/api/translate")
    fun translate(
        @RequestHeader(value = "signature") signature: String?, @Validated @RequestBody req: com.parsec.aika.common.model.vo.req.ApiTranslateReq
    ): BaseResult<com.parsec.aika.common.model.vo.resp.ApiTranslateResp> {
        Assert.notBlank(signature, "The signature parameter cannot be empty")
        Assert.state(
            SignatureUtil.verification(signature, listOf(apiKey, req.text, req.timestamp.toString(), req.language)),
            "Signature verification failed"
        )
        return BaseResult.success(apiService.translate(req.text!!, req.language ?: "ru"))
    }

    @PostMapping("/public/api/estimated-weight")
    fun estimatedWeight(
        @RequestHeader(value = "signature") signature: String?, @Validated @RequestBody req: com.parsec.aika.common.model.vo.req.ApiEstimatedWeightReq
    ): BaseResult<com.parsec.aika.common.model.vo.resp.ApiEstimatedWeightResp> {
        Assert.notBlank(signature, "The signature parameter cannot be empty")
        Assert.state(
            SignatureUtil.verification(
                signature, listOf(apiKey, req.productDescription, req.timestamp.toString())
            ), "Signature verification failed"
        )
        return BaseResult.success(apiService.estimatedWeight(req.productDescription))
    }

    @PostMapping("/public/api/openai")
    fun umayOpenai(@RequestBody body: String): BaseResult<String> {
        return BaseResult.success(apiService.umayOpenai(body))
    }

    @PostMapping("/public/api/refreshTranslateMapResource")
    fun refreshTranslateMapResource(@RequestBody apiKey: String?): BaseResult<*> {
        if (apiKey != this.apiKey) {
            return BaseResult.failure("refresh fail")
        }
        translateMapResourceService.refreshTranslateMapResource()
        return BaseResult.success("ok")
    }

    /**
     * 故事详情
     */
    @GetMapping("/public/story/{id}")
    fun getStoryDetail(@PathVariable("id") id: Long): BaseResult<Story> {
        return BaseResult.success(storyService.manageStoryDetail(id))
    }
}
