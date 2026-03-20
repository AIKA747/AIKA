package com.parsec.aika.bot.model.vo.req

class ManageEditGameReq {

    /**
     * id
     */
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
     * 排序
     */
    var orderNum: Int? = null

    /**
     * 修改人
     */
    var updater:Long? = null


    var coverDark:String? = null

    var listCoverDark:String? = null

    var free:Boolean? = null

}
