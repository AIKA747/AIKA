package com.parsec.aika.content.endpoint

import com.parsec.aika.common.model.vo.req.BotPostReq
import com.parsec.aika.content.service.PostService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

@RestController
class BotPostEndpoint {

    @Resource
    private lateinit var postService: PostService


    @PostMapping("/feign/bot/create-post")
    fun createBotPost(@RequestBody botPostReq: BotPostReq): BaseResult<Int> {
        return BaseResult.success(postService.createBotPost(botPostReq))
    }

}