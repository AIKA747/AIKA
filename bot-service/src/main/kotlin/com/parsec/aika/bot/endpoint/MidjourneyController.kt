package com.parsec.aika.bot.endpoint

import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.parsec.aika.bot.service.ChatService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class MidjourneyController {

    @Autowired
    private lateinit var chatService: ChatService

    @PostMapping("/public/mj/result")
    fun webhook(@RequestBody json: String): String {
        StaticLog.info("MidjourneyController.webhook:$json")
        val jsonObject = JSONObject(json)
        chatService.imageWebhook(jsonObject)
        return "success"
    }

}