package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull

class SubscribedBotVo {

    /**
     * 机器人id
     */
    @NotNull(message = "机器人id不能为空")
    var botId: Long? = null
}