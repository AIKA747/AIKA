package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull

class ManageGameEnableReq {
    /**
     * 游戏id
     */
    @NotNull
    var id: Long? = null

    /**
     * 游戏是否上线
     */
    @NotNull
    var enable: Boolean? = null
}