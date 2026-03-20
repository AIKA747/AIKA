package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.PutBotTaskStatusReq
import com.parsec.aika.bot.service.BotTaskService
import com.parsec.aika.common.model.entity.UserBotTask
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppBotTaskController {

    @Resource
    private lateinit var botTaskService: BotTaskService

    @GetMapping("/app/user-task")
    fun getBotTaskList(
        pageNo: Int?, pageSize: Int?, botId: Long?, user: LoginUserInfo
    ): BaseResult<PageResult<UserBotTask>> {
        return BaseResult.success(botTaskService.getBotTaskList(pageNo ?: 1, pageSize ?: 10, botId, user))
    }

    @GetMapping("/app/user-task/{id}")
    fun getBotTaskDetail(@PathVariable id: Int, user: LoginUserInfo): BaseResult<UserBotTask> {
        return BaseResult.success(botTaskService.getBotTaskDetail(id))
    }

    @PutMapping("/app/user-task/{id}")
    fun putBotTaskStatus(
        @PathVariable id: Int, @RequestBody @Validated req: PutBotTaskStatusReq, user: LoginUserInfo
    ): BaseResult<UserBotTask> {
        return BaseResult.success(botTaskService.putBotTaskStatus(id, req.status!!, req.cron, user))
    }

    @DeleteMapping("/app/user-task/{id}")
    fun deleteBotTask(@PathVariable id: Int, user: LoginUserInfo): BaseResult<Int> {
        return BaseResult.success(botTaskService.deleteBotTask(id))
    }

}