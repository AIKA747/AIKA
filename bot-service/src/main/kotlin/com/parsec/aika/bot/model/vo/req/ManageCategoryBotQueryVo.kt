package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.BotSourceEnum
import com.parsec.aika.common.model.vo.PageVo

class ManageCategoryBotQueryVo : PageVo() {

    /**
     * 机器人名称
     */
    var botName: String? = null

    /**
     * 机器人是否是数字人
     * 判断机器人中的模型字段（supportedModels）是否包含DigitaHumanService
     */
    var digitalHuman: Boolean? = null

    /**
     * 机器人来源
     */
    var botSource: BotSourceEnum? = null

    /**
     * 分类id
     */
    var categoryId: Long? = null


    var creatorName: String? = null

}