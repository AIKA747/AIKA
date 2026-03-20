package com.parsec.aika.common.model.bo

import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.Gender
import java.time.LocalDateTime

class NotifyBO {

    var type: NotifyType? = null

    var userIds: List<Long>? = null

    var authorId: Long? = null

    var avatar: String? = null

    var nickname: String? = null

    var username: String? = null

    var gender: Gender? = null

    var cover: String? = null

    var metadata: NotifyMetadata? = null

    var createdAt: LocalDateTime? = null
}

enum class NotifyType {
    thumb, post, at, comment
}

class NotifyMetadata {
    //帖子id
    var postId: Int? = null

    //帖子摘要内容
    var summary: String? = null

    //点赞数
    var likes: Long? = null

    //回复数
    var reposts: Long? = null

    //评论id
    var commentId: Int? = null

    //评论内容
    var content: String? = null

    //作者类型
    var type: AuthorType? = null
}
