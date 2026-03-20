package com.parsec.aika.bot.service

import com.parsec.aika.common.model.entity.BotTaskStatus
import com.parsec.aika.common.model.entity.UserBotTask
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

interface BotTaskService {
    fun getBotTaskList(pageNo: Int, pageSize: Int, botId: Long?, user: LoginUserInfo): PageResult<UserBotTask>?
    fun getBotTaskDetail(id: Int): UserBotTask?
    fun putBotTaskStatus(
        id: Int, status: BotTaskStatus, cron: String? = null, user: LoginUserInfo? = null
    ): UserBotTask?

    fun deleteBotTask(id: Int): Int?

    /**
     * 关闭用户当前机器人最近一次生成的还在执行的任务
     */
    fun closeBotTask(userId: Long?, botId: Long?)

    /**
     * 执行机器人任务
     */
    fun executeTask(taskId: Int)

    /**
     * 管理端查询机器人任务列表
     */
    fun getManageBotTaskList(
        pageNo: Int?, pageSize: Int?, status: BotTaskStatus?, minTime: String?, maxTime: String?, user: LoginUserInfo
    ): PageResult<UserBotTask>?


}
