package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo


class GetAppRecommendBotsReq: PageVo() {
    // 机器人名称
    var botName: String? = null

    var creator: Long? = null
}