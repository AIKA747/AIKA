package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull

data class UpdateGameResultReq(
        @field:NotNull(message = "ID不能为空") var id: Long? = null,
        @field:NotNull(message = "游戏ID不能为空") var gameId: Long? = null,
        @field:NotNull(message = "结果概要不能为空") var summary: String? = null,
        @field:NotNull(message = "结果描述不能为空") var description: String? = null,
        @field:NotNull(message = "封面图片不能为空") var cover: String? = null
)
