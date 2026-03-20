package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.resp.GameResultListRespDTO

interface GameAiAssistantService {

    /**
     * 校验用户消息是否为问题的答案之一
     * 若是，则直接返回空字符
     * 若不是问题的答案之一，则返回返回引导用户回答的引导对话
     */
    fun checkGameQuestionAnswer(question: String, answer: String, gameId: Long, communicationStyle: String?): String?

    /**
     * 匹配游戏结果
     */
    fun matchGameResult(threadId: Long, userId: Long): GameResultListRespDTO

    /**
     *已完成游戏聊天消息响应
     */
    fun completeGameChatMsg(gameId: Long?, threadId: Long?, userId: Long, communicationStyle: String?): String
}