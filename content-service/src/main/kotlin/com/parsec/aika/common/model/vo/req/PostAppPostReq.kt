package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.entity.ThreadContent

data class PostAppPostReq(
    var title: String? = null,
    var summary: String? = null,
    var thread: List<ThreadContent>? = null,
    var cover: String? = null,
    var topicTags: String? = null
)
