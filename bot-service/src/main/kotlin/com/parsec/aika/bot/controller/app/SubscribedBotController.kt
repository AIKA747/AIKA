package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.SubscribedBotQueryVo
import com.parsec.aika.bot.model.vo.req.SubscribedBotVo
import com.parsec.aika.bot.model.vo.resp.BotListVo
import com.parsec.aika.bot.service.BotSubscriptionService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class SubscribedBotController {

    @Resource
    private lateinit var botSubscriptionService: BotSubscriptionService

    /**
     * 我订阅的机器人列表
     */
    @GetMapping("/app/subscribed-bots")
    fun getSubscribedBots(req: SubscribedBotQueryVo, user: LoginUserInfo): BaseResult<PageResult<BotListVo>> {
        return BaseResult.success(botSubscriptionService.mySubscribedBots(req, user))
    }

    /**
     * 订阅机器人
     */
    @PostMapping("/app/subscription")
    fun subscribeBot(@Validated @RequestBody vo: SubscribedBotVo, user: LoginUserInfo): BaseResult<Void> {
        botSubscriptionService.subscribedBot(vo.botId!!, user)
        return BaseResult.success()
    }

    /**
     * 取消订阅机器人
     */
    @DeleteMapping("/app/bot/{id}/unsubscribe")
    fun unsubscribeBot(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        botSubscriptionService.unsubscribedBot(id, user)
        return BaseResult.success()
    }


}