package com.parsec.aika.common.model.bo

import com.parsec.aika.user.domain.NotifyMetadata
import com.parsec.aika.user.model.em.Gender
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
