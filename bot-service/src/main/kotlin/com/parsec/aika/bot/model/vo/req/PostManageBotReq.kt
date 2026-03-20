package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.entity.DigitalHumanProfile


class PostManageBotReq : PostAppBotReq() {
    var digitalHumanProfile: DigitalHumanProfile? = null

    /**
     * 标签逗号分隔
     */
    var tags: String? = null

    /**
     * 欢迎语
     */
    var greetWords: String? = null

    /**
     * 打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼
     */
    var salutationFrequency: Int? = null

    /**
     * 预留字段（许久没有聊天，机器人主动打招呼prompt）
     */
    var salutationPrompts: String? = null

    var postingFrequecy: String? = null

    var postingPrompt: String? = null

    var postingEnable: Boolean? = null
}