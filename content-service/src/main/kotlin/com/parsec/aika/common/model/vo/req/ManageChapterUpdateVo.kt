package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.entity.StoryChapterRules
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

class ManageChapterUpdateVo {

    @NotNull
    var id: Long? = null

    /**
     * 章节名称，非必填
     */
    var chapterName: String? = null

    // 摘要
    @NotNull
    var summary: String? = null

    /**
     * 章节顺序，从1开始。
     */
    @NotNull
    var chapterOrder: Int? = null

    /**
     * 章节封面
     */
    var cover: String? = null
    var coverDark: String? = null

    /**
     * 章节封面（用于列表）
     */
    var listCover: String? = null
    var listCoverDark: String? = null

    /**
     * 此阶段的形象
     */
    @NotBlank
    var image: String? = null

    /**
     * 描述个性的Prompt
     */
    var personality: String? = null

    /**
     * 章节情节说明
     */
    var introduction: String? = null

    /**
     * 通关文案
     */
    var passedCopywriting: String? = null

    /**
     * 通关图片
     */
    var passedPicture: String? = null

    /**
     * 背景介绍提示词
     */
    @NotBlank
    var backgroundPrompt: String? = null

    /**
     * 回答语气限定提示词
     */
    var tonePrompt: String? = null

    /**
     * 字数限制提示词：short简短回答（20字以内） normal普通篇幅（20-50）detail详细回答（50-100）
     */
    var wordNumberPrompt: String? = null

    /**
     * 本章目标分
     */
    @NotNull
    var chapterScore: Int? = null

    /**
     * 章节游戏规则
     */
    @NotEmpty
    var chapterRule: List<StoryChapterRules>? = null

    var chatMinutes: Int? = null

    //章节任务信息
    var taskIntroduction: String? = null
    //背景图片
    var backgroundPicture: String? = null
    var backgroundPictureDark: String? = null

}
