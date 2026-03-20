package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

class AppChatRecordQueryVo : PageVo() {

    /**
     * 机器人id
     *  不能为空
     */
    var botId: Long? = null

    /**
     * 查询时间
     * 不为空，查询聊天消息记录createdAt >= 该值的数据
     */
    var lastTime: String? = null

    /**
     * game.threadId
     */
    var threadId: String? = null
}