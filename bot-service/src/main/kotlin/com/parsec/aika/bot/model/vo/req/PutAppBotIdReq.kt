package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.Gender
import javax.validation.constraints.NotNull


class PutAppBotIdReq {

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
     * 数字人配置
     */
//    @JsonSerialize(using = ToStringSerializer::class)
//    var digitalHumanProfile: DigitalHumanProfile? = null

    /**
     * 性别
     */
    var gender: Gender? = null

    var knowledgeEnable: Boolean? = null

    /**
     * 学习文件路径集合
     */
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
     * 标签逗号分隔
     */
    var tags: String? = null

    /**
     * 欢迎语
     */
    var greetWords: String? = null

    /**
     * 打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼
     */
    var salutationFrequency: Int? = null

    /**
     * 预留字段（许久没有聊天，机器人主动打招呼prompt）
     */
    var salutationPrompts: String? = null

    /**
     * 聊天提示语
     */
    var dialogueTemplates: List<String>? = null

    var postingFrequecy: String? = null

    var postingPrompt: String? = null

    var postingEnable: Boolean? = null


}
