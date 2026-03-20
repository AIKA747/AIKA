package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.Gender
import javax.validation.constraints.NotNull

class AppAssistantGenderReq {

    /**
     * 助手id
     */
    var assistantId: Long? = null

    /**
     * 性别
     */
    @NotNull(message = "助手性别不能为空")
    var gender: Gender? = null

}