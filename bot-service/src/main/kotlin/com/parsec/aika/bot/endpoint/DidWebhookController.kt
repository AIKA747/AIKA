package com.parsec.aika.bot.endpoint

import cn.hutool.json.JSONObject
import com.parsec.aika.bot.service.ChatService
import com.parsec.aika.bot.service.DidService
import com.parsec.aika.bot.service.VideoRecordService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class DidWebhookController {

    @Autowired
    private lateinit var didService: DidService

    @Autowired
    private lateinit var chatService: ChatService

    @Autowired
    private lateinit var videoRecordService: VideoRecordService

    @PostMapping("/public/did/talk/webhook")
    fun talkWebhook(@RequestBody reqBody: String): String {
        val reqObj = JSONObject(reqBody)
        val id = reqObj.getStr("id")
        didService.talkWebhook(id, reqBody)
        chatService.videoWeebhook(reqObj)
        videoRecordService.getManageBotDigitalHumanSalutationId(id)

        return "success"
    }

    @PostMapping("/public/did/animation/webhook")
    fun animationWebhook(@RequestBody resp: String): String {
        didService.animationWebhook(resp)
        return "success"
    }


}