package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer


class GetAppBotCategoryResp  {
    /**
     * 分类id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 分类名称
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

    var tags: List<String> ?= null
}
