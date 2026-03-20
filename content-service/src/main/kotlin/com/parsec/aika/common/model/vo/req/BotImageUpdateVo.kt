package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.entity.BotImage
import jakarta.validation.constraints.NotNull

class BotImageUpdateVo {
    @NotNull(message = "botImage not null")
    var botImage: BotImage? = null

    @NotNull(message = "botId not null")
    var botId: Long? = null

}
