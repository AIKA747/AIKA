package com.parsec.aika.bot.model.vo.req

import com.baomidou.mybatisplus.annotation.EnumValue
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.common.model.entity.RuleElement
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

class ManageAssistantEditVo {

    /**
     * 助手id
     */
    var id: Long? = null

    /**
     * 助手男性头像
     */
    @NotBlank
    var maleAvatar: String? = null

    /**
     * 助手女性头像
     */
    @NotBlank
    var femaleAvatar: String? = null

    /**
     * 欢迎语
     */
    @NotBlank
    var greetWords: String? = null

    /**
     * 年龄
     */
    @NotNull
    var age: Int? = null

    /**
     * 职业
     */
    @NotBlank
    var profession: String? = null

    /**
     * 机器人扮演的角色
     */
    @NotBlank
    var botCharacter: String? = null

    /**
     * 擅长领域
     */
    @NotBlank
    var personalStrength: String? = null

    /**
     * 回答策略
     */
    @NotEmpty
    var answerStrategy: List<String>? = null

    /**
     * 机器人推荐策略
     */
    @EnumValue
    @NotNull
    var botRecommendStrategy: RecommendStrategy? = null

    /**
     * 故事推荐策略
     */
    @EnumValue
    @NotNull
    var storyRecommendStrategy: RecommendStrategy? = null

    /**
     * 回答策略集合
     */
    @NotEmpty
    var rules: List<RuleElement>? = null

    /**
     * 预留字段（许久没有聊天，机器人主动打招呼prompt）
     */
    var salutationPrompts: String? = null

    /**
     * 打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼
     */
    var salutationFrequency: Int? = null

    var prompts: String? = null

    /**
     * 支持的数字人配置
     */
    @NotEmpty
    var digitaHumanService: List<String>? = null
}