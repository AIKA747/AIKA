package com.parsec.aika.common.model.dto

import com.parsec.aika.common.model.em.AuthorType
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

class ChatroomMemberVo {
    /**
     * 成员类型：USER、BOT
     */
    @field:NotNull(message = "is required")
    var memberType: AuthorType? = null

    @field:NotNull(message = "is required")
    var memberId: Long? = null

    @field:NotEmpty(message = "is required")
    var avatar: String? = null

    @field:NotEmpty(message = "is required")
    var nickname: String? = null

    @field:NotEmpty(message = "is required")
    var username: String? = null
}
