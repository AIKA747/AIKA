package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull

class JoinRoomReq {

    @NotNull(message = "roomId cannot be null")
    var roomId: Int? = null
}