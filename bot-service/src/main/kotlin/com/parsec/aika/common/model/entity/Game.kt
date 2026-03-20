package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate
import java.time.LocalDateTime

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/7.
 */
@Translate(fields = ["gameName", "introduce"])
@TableName("game", autoResultMap = true)
class Game {

    @JsonSerialize(using = ToStringSerializer::class)
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null // 创建时间

    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null // 修改时间

    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null

    @TableLogic(value = "0", delval = "1")
    var deleted: Boolean? = null

    /**
     * 指南
     */
    var instructions: String? = null

    /**
     * 游戏名称
     */
    var gameName: String? = null

    /**
     * AI角色
     */
    var assistantName: String? = null

    /**
     * 使用工具
     */
    var tools: String? = null

    /**
     * 使用的模型
     */
    var model: String? = null

    /**
     * assistantId
     */
    var assistantId: String? = null

    /**
     * 游戏介绍
     */
    var introduce: String? = null

    /**
     * 列表封面的描述
     */
    var description: String? = null

    /**
     * 问题
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var questions: List<String>? = null

    /**
     * 封面URL
     */
    var cover: String? = null

    /**
     * 列表封面URL
     */
    var listCover: String? = null

    /**
     * 头像图片URL
     */
    var avatar: String? = null

    /**
     * 知识文档URL
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var knowledge: List<String>? = null

    /**
     * 列表描述文字
     */
    var listDesc: String? = null

    /**
     * 上线/下线标志
     */
    var enable: Boolean? = null

    /**
     * 排序
     */
    var orderNum: Int = 0

    var creator: Long? = null

    var updater: Long? = null

    var coverDark: String? = null

    var listCoverDark: String? = null

    var free: Boolean? = null


}

