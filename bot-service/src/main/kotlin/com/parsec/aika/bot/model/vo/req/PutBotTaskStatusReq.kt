package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.entity.BotTaskStatus
import org.jetbrains.annotations.NotNull

class PutBotTaskStatusReq {

    @NotNull
    var status: BotTaskStatus? = null

    var cron: String? = null
}