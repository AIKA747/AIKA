package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull

data class CreateGameThreadReq(@field:NotNull var gameId: Long? = null, var restart: Boolean? = false)
