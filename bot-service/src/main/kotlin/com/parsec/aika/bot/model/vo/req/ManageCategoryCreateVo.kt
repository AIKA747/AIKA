package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotNull

class ManageCategoryCreateVo {

    /**
     * 分类名
     */
    @NotNull(message = "分类名称不能为空")
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
    var botIds: List<Long>? = null

    var tags: List<String> ?= null
}
