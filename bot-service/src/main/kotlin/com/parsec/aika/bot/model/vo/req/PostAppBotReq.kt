package com.parsec.aika.bot.model.vo.req

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.Gender
import javax.validation.constraints.NotNull


open class PostAppBotReq {

    /**
     * 年龄
     */
    @NotNull
    var age: Int? = null

    /**
     * 头像
     */
    @NotNull
    var avatar: String? = null

    /**
     * 特点
     */
    @NotNull
    var botCharacter: String? = null

    /**
     * 机器人介绍
     */
    @NotNull
    var botIntroduce: String? = null

    /**
     * 机器人名称
     */
    @NotNull
    var botName: String? = null

    /**
     * 分类（栏目）id
     */
//    @NotNull
//    @JsonSerialize(using = ToStringSerializer::class)
    var categoryId: Long? = null

    /**
     * 分类（栏目）名称
     */
//    @NotNull
    var categoryName: String? = null

    /**
     * 回答风格
     */
    @NotNull
    var conversationStyle: String? = null

    /**
     * 性别：1男，2女
     */
    @NotNull
    var gender: Gender? = null

    var knowledgeEnable: Boolean? = null

    /**
     * 学习文件路径集合
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var knowledges: List<String>? = null

    /**
     * 个人实力
     */
    @NotNull
    var personalStrength: String? = null

    /**
     * 职业
     */
    @NotNull
    var profession: String? = null

    var prompts: String? = null

    /**
     * 回答策略id集合
     */
    @NotNull
    var rules: List<String>? = null

    /**
     * 支持模型
     */
    var supportedModels: List<String>? = null

    /**
     * 是否公开机器人
     */
    @NotNull
    var visibled: Boolean? = null

    /**
     * 相册
     */
    var album: List<String>? = null

    /**
     * 聊天提示语
     */
    var dialogueTemplates: List<String>? = null

}