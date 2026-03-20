package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

class ManageGameDetailResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

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

    var createdAt: LocalDateTime? = null // 创建时间

    var updatedAt: LocalDateTime? = null // 修改时间

    var dataVersion: Int? = null

    var deleted: Boolean? = null

    var coverDark:String? = null

    var listCoverDark:String? = null

    var free:Boolean? = null

}
