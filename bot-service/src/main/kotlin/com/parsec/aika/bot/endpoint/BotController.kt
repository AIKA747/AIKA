package com.parsec.aika.bot.endpoint

import cn.hutool.log.StaticLog
import com.parsec.aika.bot.model.vo.req.BotImageUpdateReq
import com.parsec.aika.bot.service.BotService
import com.parsec.aika.bot.service.BotSubscriptionService
import com.parsec.aika.bot.service.BotTaskService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/11.
 */
@RestController
@RequestMapping("/feign")
class BotController {

    @Resource
    private lateinit var botService: BotService

    @Resource
    private lateinit var botSubscriptionService: BotSubscriptionService

    @Resource
    private lateinit var botTaskService: BotTaskService

    @GetMapping("/bot/bot-name-check")
    fun checkBotNameExists(@RequestParam name: String): Boolean {
        return botService.existsByName(name)
    }

    @PutMapping("/bot/subscription/bot-image/update")
    fun updateBotImage(@RequestBody req: BotImageUpdateReq): BaseResult<*> {
        botSubscriptionService.botSubscribedSyncInfo(req.botId!!, req.userId!!, req.botImage!!)
        return BaseResult.success()
    }

    /**
     * 执行机器人创建帖子任务
     */
    @GetMapping("/bot/post/create")
    fun createBotPost(botId: Long): BaseResult<*> {
        botService.createBotPost(botId)
        return BaseResult.success()
    }

    /**
     * 执行机器人用户聊天任务
     */
    @GetMapping("/bot/task/execute")
    fun executeTask(taskId: Int): BaseResult<*> {
        StaticLog.info("execute task: $taskId")
        botTaskService.executeTask(taskId)
        return BaseResult.success()
    }
}

