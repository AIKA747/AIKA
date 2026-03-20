package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.em.PostMessageType

class PostMessageBO {
    /**
     * post对象id
     */
    var id: Int? = null

    /**
     * 作者ID，这里是userId，而不是Author对象的ID，它和下面的type构成了作者的唯一标识
     */
    var author: Long? = null

    /**
     * comment的内容前50个字符
     */
    var commentContent: String? = null

    /**
     * 消息类型：
     *      comment：评论消息
     *      thumb：点赞消息
     */
    var type: PostMessageType? = null
}