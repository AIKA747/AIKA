package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo


class GetAppOwnerBotsReq: PageVo() {
    // 指定关注用户的id集合 逗号分隔
    var botOwnerIds: String? = null
    var botOwnerIdList: List<Long>? = null
}