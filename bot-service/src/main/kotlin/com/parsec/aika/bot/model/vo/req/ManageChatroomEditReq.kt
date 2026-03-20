package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotBlank

class ManageChatroomEditReq {
    @NotBlank
    var roomName: String? = null
    var roomAvatar: String? = null
    var description: String? = null
    var ownerId: Long? = null

    var id: Int? = null
}

