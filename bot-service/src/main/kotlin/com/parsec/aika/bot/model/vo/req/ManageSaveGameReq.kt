package com.parsec.aika.bot.model.vo.req

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty

class ManageSaveGameReq {
    /**
     * 指南
     */
    @NotEmpty(message = "Instructions cannot be empty")
    var instructions: String? = null

    /**
     * 游戏名称
     */
    @NotEmpty(message = "Game's name cannot be empty")
    var gameName: String? = null

    /**
     * AI角色
     */
    @NotEmpty(message = "AI role cannot be empty")
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
    @NotBlank
    var introduce: String? = null

    /**
     * 列表封面的描述
     */
    @NotBlank
    var description: String? = null

    /**
     * 问题
     */
    var questions: List<String>? = null

    /**
     * 封面URL
     */
    @NotBlank
    var cover: String? = null

    /**
     * 列表封面URL
     */
    @NotBlank
    var listCover: String? = null

    /**
     * 头像图片URL
     */
    @NotBlank
    var avatar: String? = null

    /**
     * 知识文档URL
     */
    var knowledge: List<String>? = null

    /**
     * 列表描述文字
     */
    @NotBlank
    var listDesc: String? = null


    var creator:Long? = null

    var updater:Long? = null


    var coverDark:String? = null

    var listCoverDark:String? = null

    var free:Boolean? = null

}
