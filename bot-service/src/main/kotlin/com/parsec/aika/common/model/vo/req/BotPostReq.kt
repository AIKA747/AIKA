package com.parsec.aika.common.model.vo.req

data class BotPostReq(
    var botId: Long? = null,
    var title: String? = null,
    var summary: String? = null,
    var cover: String? = null,
    var topicTags: String? = null
)