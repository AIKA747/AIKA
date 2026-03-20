package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.handler.RuleElementTypeHandler
import com.parsec.aika.common.model.em.RecommendStrategy
import java.time.LocalDateTime

@TableName("assistant", autoResultMap = true)
open class Assistant {

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
     * 助手男性头像
     */
    var maleAvatar: String? = null

    /**
     * 助手女性头像
     */
    var femaleAvatar: String? = null

    /**
     * 欢迎语
     */
    var greetWords: String? = null

    /**
     * 年龄
     */
    var age: Int? = null

    /**
     * 职业
     */
    var profession: String? = null

    /**
     * 机器人扮演的角色
     */
    var botCharacter: String? = null

    /**
     * 擅长领域
     */
    var personalStrength: String? = null

    /**
     * 回答策略
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var answerStrategy: List<String>? = null

    /**
     * 机器人推荐策略
     */
    var botRecommendStrategy: RecommendStrategy? = null

    /**
     * 故事推荐策略
     */
    var storyRecommendStrategy: RecommendStrategy? = null

    /**
     * 回答策略集合
     */
    @TableField(typeHandler = RuleElementTypeHandler::class)
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
    @TableField(typeHandler = JacksonTypeHandler::class)
    var digitaHumanService: List<String>? = null
}


class RuleElement {
    /**
     * 规则key
     */
    var key: String? = null

    /**
     * 规则
     */
    var rule: RuleRule? = null
}

/**
 * 规则
 */
class RuleRule {
    /**
     * 推荐回答
     */
    var answer: String? = null

    /**
     * 问题
     */
    var question: String? = null

    /**
     * 权重
     */
    var weight: String? = null
}