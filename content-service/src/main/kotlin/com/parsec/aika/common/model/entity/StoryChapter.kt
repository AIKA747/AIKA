package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.handler.ChapterRuleTypeHandler

/**
 * 章节信息
 */
@TableName("t_story_chapter", autoResultMap = true)
class StoryChapter : BaseDomain() {
    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    // 章节名称
    var chapterName: String? = null

    // 章节顺序，从1开始。
    var chapterOrder: Int? = null

    // 章节封面
    var cover: String? = null
    var coverDark: String? = null

    // 章节列表封面
    var listCover: String? = null
    var listCoverDark: String? = null

    // 阶段形象
    var image: String? = null

    // 描述个性的Prompt
    var personality: String? = null

    // 情节描述
    var introduction: String? = null

    // 通关文案
    var passedCopywriting: String? = null

    // 通关图片
    var passedPicture: String? = null

    // 背景介绍词
    var backgroundPrompt: String? = null

    // 回答语气限定提示词
    var tonePrompt: String? = null

    // 字数限制提示词：short简短回答（20字以内） normal普通篇幅（20-50）detail详细回答（50-100）
    var wordNumberPrompt: String? = null

    // 本章目标分
    var chapterScore: Int? = null

    // 游戏章节规则
    @TableField(typeHandler = ChapterRuleTypeHandler::class)
    var chapterRule: List<StoryChapterRules>? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    // 摘要
    var summary: String? = null

    //章节聊天分钟数
    var chatMinutes: Int? = null

    //章节任务信息
    var taskIntroduction: String? = null

    //背景图片
    var backgroundPicture: String? = null
    var backgroundPictureDark: String? = null
}

class StoryChapterRules {
    var key: String? = null
    var rule: StoryChapterRule? = null
}

class StoryChapterRule {
    // 问Chatgpt的问题，对用户的问题进行分析性
    var question: String? = null

    // 推荐回答
    var recommendAnswer: String? = null

    // 权重
    var weight: Int? = null

    // 友好度
    var friendDegree: Int? = null

    // 故事进展
    var storyDegree: Int? = null

}