package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo


class GetAppBotCategoryReq: PageVo() {
    // 机器人扮演的角色名称
    var categoryName: String? = null
}