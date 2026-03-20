package com.parsec.aika.bot.model.vo.req

import org.jetbrains.annotations.NotNull
import javax.validation.constraints.NotEmpty

class ChatroomMsgLastTimeReq {
    /**
     * 群聊id
     */
    @NotEmpty
    var roomIds: List<Int>? = null

    @NotNull
    var type: LastTimeType? = null

}

enum class LastTimeType {
    READ, LOAD
}
