package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.em.Gender


class BotDetailVO {

    /**
     * 机器人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 年龄
     */
    var age: Int? = null

    /**
     * 相册
     */
    var album: List<String>? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 特点
     */
    var botCharacter: String? = null

    /**
     * 机器人介绍
     */
    var botIntroduce: String? = null

    /**
     * 机器人名称
     */
    var botName: String? = null

    /**
     * builtIn，userCreated
     */
    var botSource: String? = null

    /**
     * 机器人状态：Online,Offline
     */
    var botStatus: BotStatusEnum? = null

    /**
     * 聊天数
     */
    var chatTotal: Int? = null

    /**
     * 回答风格
     */
    var conversationStyle: String? = null

    /**
     * 对话数
     */
    var dialogues: Int? = null

    /**
     * 性别：1男，2女
     */
    var gender: Gender? = null

    /**
     * 0关闭，1开启
     */
    var knowledgeEnable: Boolean? = null

    /**
     * 学习文件路径集合
     */
    var knowledges: List<String>? = null

    /**
     * 个性
     */
    var personality: String? = null

    /**
     * 特长
     */
    var personalStrength: String? = null

    /**
     * 职业
     */
    var profession: String? = null

    var prompts: String? = null

    /**
     * 评分
     */
    var rating: Double? = null

    /**
     * 是否推荐
     */
    var recommend: Boolean? = null

    /**
     * 推荐封面
     */
    var recommendImage: String? = null

    /**
     * 推荐词
     */
    var recommendWords: String? = null

    /**
     * 推荐排序
     */
    var sortNo: Int? = null

    /**
     * 订阅者数量
     */
    var subscriberTotal: Int? = null

    /**
     * 支持模型，多个使用逗号分隔：Midjourney，DigitaHumanService
     */
    var supportedModels: List<String>? = null

    /**
     * 用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 是否公开机器人
     */
    var visibled: Boolean? = null

}