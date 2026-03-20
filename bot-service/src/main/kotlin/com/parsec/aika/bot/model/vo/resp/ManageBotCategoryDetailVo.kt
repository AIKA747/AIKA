package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

class ManageBotCategoryDetailVo {

    /**
     * 分类id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var categoryId: Long? = null

    /**
     * 分类名
     */
    var categoryName: String? = null

    /**
     * 封面
     */
    var cover: String? = null

    /**
     * 介绍
     */
    var introduction: String? = null

    /**
     * 排序
     */
    var sortNo: Int? = null

    /**
     * 机器人id集合
     */
    var botIds: List<String>? = null

    var tags: List<String> ?= null
}
