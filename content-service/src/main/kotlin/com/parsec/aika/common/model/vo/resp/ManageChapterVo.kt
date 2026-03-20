package com.parsec.aika.common.model.vo.resp

import com.baomidou.mybatisplus.annotation.TableField
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.handler.ChapterRuleTypeHandler
import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.entity.StoryChapterRules

class ManageChapterVo {

    /**
     * 主键id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    /**
     * 背景介绍提示词
     */
    var backgroundPrompt: String? = null

    /**
     * 章节名称，非必填
     */
    var chapterName: String? = null

    // 摘要
    var summary: String? = null

    /**
     * 章节顺序，从1开始。
     */
    var chapterOrder: Int? = null

    /**
     * 章节游戏规则
     */
    @TableField(typeHandler = ChapterRuleTypeHandler::class)
    var chapterRule: List<StoryChapterRules>? = null

    /**
     * 本章目标分
     */
    var chapterScore: Int? = null

    /**
     * 章节封面
     */
    var cover: String? = null
    var coverDark: String? = null

    /**
     * 此阶段的形象
     */
    var image: String? = null

    /**
     * 章节情节说明
     */
    var introduction: String? = null

    /**
     * 章节封面（用于列表）
     */
    var listCover: String? = null
    var listCoverDark: String? = null

    /**
     * 通关文案
     */
    var passedCopywriting: String? = null

    /**
     * 通关图片
     */
    var passedPicture: String? = null

    /**
     * 描述个性的Prompt
     */
    var personality: String? = null

    /**
     * 回答语气限定提示词
     */
    var tonePrompt: String? = null

    /**
     * 修改时间
     */
    var updatedAt: String? = null

    /**
     * 字数限制提示词：short简短回答（20字以内） normal普通篇幅（20-50）detail详细回答（50-100）
     */
    var wordNumberPrompt: String? = null

    var chapterGifts: List<Gift>? = null

    /**
     * 创建时间
     */
    var createdAt: String? = null

    /**
     * 创建的管理员id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    var chatMinutes: Int? = null

    //章节任务信息
    var taskIntroduction: String? = null
    //背景图片
    var backgroundPicture: String? = null
    var backgroundPictureDark: String? = null
}
