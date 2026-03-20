package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.service.BotTaskService
import com.parsec.aika.common.model.entity.BotTaskStatus
import com.parsec.aika.common.model.entity.UserBotTask
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageUserTaskController {

    @Resource
    private lateinit var botTaskService: BotTaskService

    @GetMapping("/manage/user/task")
    fun getBotTaskList(
        pageNo: Int?, pageSize: Int?, status: BotTaskStatus?, minTime: String?, maxTime: String?, user: LoginUserInfo
    ): BaseResult<PageResult<UserBotTask>> {
        return BaseResult.success(botTaskService.getManageBotTaskList(pageNo, pageSize, status, minTime, maxTime, user))
    }

}