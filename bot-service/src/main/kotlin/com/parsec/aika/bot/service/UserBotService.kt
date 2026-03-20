package com.parsec.aika.bot.service

interface UserBotService {

    /**
     * 用户机器人数量统计
     */
    fun getUserCreatedBotNum(userId: Long): Int

    /**
     * 统计机器人会话数量
     * 查询该机器人与多少名用户有过对话
     */
    fun getBotDialogues(botId: Long): Int

}