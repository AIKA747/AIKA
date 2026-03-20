package com.parsec.aika.bot.endpoint

import cn.hutool.log.StaticLog
import com.parsec.aika.bot.service.BotMessageService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class UserChatNumController {

    @Autowired
    private lateinit var botMessageService: BotMessageService


    @GetMapping("/feign/chat/num")
    fun chatNum(userId: Long, minTime: String?, maxTime: String?, botId: Long?): BaseResult<Int> {
        StaticLog.info("chatNum: userId: {}, minTime: {}, maxTime: {}, botId: {}", userId, minTime, maxTime, botId)
        return BaseResult.success(botMessageService.chatNum(userId, minTime, maxTime, botId))
    }


}