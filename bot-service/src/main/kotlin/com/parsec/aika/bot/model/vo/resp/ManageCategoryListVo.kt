package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

class ManageCategoryListVo {

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
     * 机器人总数
     */
    var botCount: Int? = null

    /**
     * 是否内置分类：0否，1是
     */
    var builtIn: Boolean? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 介绍
     */
    var introduction: String? = null

    /**
     * 推荐排序
     */
    var sortNo: Int? = null

    var tags: List<String> ?= null
}
