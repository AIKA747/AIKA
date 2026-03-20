package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.parsec.trantor.mybatisplus.base.BaseDomain

@TableName("category", autoResultMap = true)
class Category : BaseDomain() {

    /**
     * 机器人总数
     */
    var botCount: Int? = null

    /**
     * 栏目名称
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
     * 推荐排序
     */
    var sortNo: Int? = null

    /**
     * 是否内置分类：0否，1是
     */
    var builtIn: Boolean? = null

    /**
     * 创建人id
     */
    var creator: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    /**
     * 更新人
     */
    var updater: Long? = null

    @TableField(typeHandler = JacksonTypeHandler::class)
    var tags: List<String> ?= null

}
