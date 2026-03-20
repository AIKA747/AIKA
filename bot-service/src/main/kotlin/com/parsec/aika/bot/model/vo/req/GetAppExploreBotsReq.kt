package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo


class GetAppExploreBotsReq : PageVo() {
    // 关键词
    var keyword: String? = null

    /**
     * 0全部，1栏目，2机器人
     */
    var type: Int? = 0

    /**
     * 分类的id
     */
    var categoryId: String? = null

    /**
     * 按tag搜索
     */
    var tag: String? = null
}