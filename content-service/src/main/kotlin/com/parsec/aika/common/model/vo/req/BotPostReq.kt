package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.entity.ThreadContent

data class BotPostReq(
    var botId: Long? = null,
    var title: String? = null,
    var summary: String? = null,
    var cover: String? = null,
    var thread: List<ThreadContent>? = null,
    var topicTags: String? = null
)