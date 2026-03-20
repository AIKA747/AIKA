package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull


class PutManageBotRecommendReq {

    /**
     * 排序
     */
    var sortNo: Int? = null

    /**
     * 推荐封面
     */
//    @NotNull
    var recommendImage: String? = null

    /**
     * 推荐词
     */
    @NotNull
    var recommendWords: String? = null

    /**
     * 机器人id
     */
    @NotNull
    var botId: Long? = null

}
