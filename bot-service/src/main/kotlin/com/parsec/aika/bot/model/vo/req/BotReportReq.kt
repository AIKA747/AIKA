package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull

class BotReportReq {
    /**
     * 行为
     */
    var behavior: String? = null

    /**
     * 机器人id
     */
    @NotNull
    var botId: Long? = null

    /**
     * 内容
     */
    var content: String? = null

    /**
     * 详情
     */
    var details: String? = null

    /**
     * 图片集合
     */
    var images: List<String>? = null
}