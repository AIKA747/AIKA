package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotSourceEnum
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.em.Gender
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("bot", autoResultMap = true)
class Bot : BaseDomain() {


    /**
     * 标签逗号分隔
     */
    var tags: String? = null

    /**
     * builtIn，userCreated
     */
    var botSource: BotSourceEnum? = null

    /**
     * 机器人名称
     */
    var botName: String? = null

    /**
     * 机器人介绍
     */
    var botIntroduce: String? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 性别：'MALE','FEMALE'
     */
    var gender: Gender? = null

    /**
     * 年龄
     */
    var age: Int? = null

    /**
     * 分类（栏目）id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var categoryId: Long? = null

    /**
     * 分类（栏目）名称
     */
    var categoryName: String? = null

    /**
     * 职业
     */
    var profession: String? = null

    /**
     * 个性
     */
    var personality: String? = null

    /**
     * 机器人扮演的角色
     */
    var botCharacter: String? = null

    /**
     * 擅长领域
     */
    var personalStrength: String? = null

    /**
     * 回答风格
     */
    var conversationStyle: String? = null

    /**
     * 回答策略集合
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var rules: List<String>? = null

    var prompts: String? = null

    /**
     * 0关闭，1开启
     */
    var knowledgeEnable: Boolean? = null

    /**
     * 学习文件路径集合
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var knowledges: List<String>? = null

    /**
     * 支持模型：Midjourney，DigitaHumanService
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var supportedModels: List<String>? = null

    /**
     * 相册
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var album: List<String>? = null

    /**
     * 机器人状态：unrelease,online,offline
     */
    var botStatus: BotStatusEnum? = null

    /**
     * 是否公开机器人
     */
    var visibled: Boolean? = null

    /**
     * 评分
     */
    var rating: Double? = null

    /**
     * 聊天数
     */
    var chatTotal: Int? = null

    /**
     * 订阅数量
     */
    var subscriberTotal: Int? = null

    /**
     * 对话数
     */
    var dialogues: Int? = null

    /**
     * 推荐排序
     */
    var sortNo: Int? = null

    /**
     * 欢迎语
     */
    var greetWords: String? = null

    /**
     * 是否推荐
     */
    var recommend: Boolean? = null

    /**
     * 推荐封面
     */
    var recommendImage: String? = null

    /**
     * 推荐时间
     */
    var recommendTime: LocalDateTime? = null

    /**
     * 推荐词
     */
    var recommendWords: String? = null

    /**
     * 打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼
     */
    var salutationFrequency: Int? = null

    /**
     * 预留字段（许久没有聊天，机器人主动打招呼prompt）
     */
    var salutationPrompts: String? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    /**
     * 更新人
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var updater: Long? = null

    @TableField(typeHandler = JacksonTypeHandler::class)
    var dialogueTemplates: List<String>? = null

    var postingFrequecy: String? = null

    var postingPrompt: String? = null

    var postingEnable: Boolean? = null

}