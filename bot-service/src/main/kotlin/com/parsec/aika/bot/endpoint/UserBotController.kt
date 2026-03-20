package com.parsec.aika.bot.endpoint

import com.parsec.aika.bot.service.BotSubscriptionService
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class UserBotController {

    @Resource
    private lateinit var botSubscriptionService: BotSubscriptionService

    /**
     * 获取指定用户订阅机器人id集合
     */
    @RequestMapping("/feign/user/{id}/subscribe-bots")
    fun subscribeBots(@PathVariable("id") id: Long, botIds: List<String>?): List<Long> {
        return botSubscriptionService.feignSubscribedBotList(id, botIds)
    }

}