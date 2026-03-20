package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.em.Gender

/**
 * @author RainLin
 * @since 2024/1/26 11:31
 */
@Translate(["storyName", "introduction", "passedCopywriting", "failureCopywriting", "chapterName", "rewardsScore"])
class GetAppStoryIdResp {
    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    // 故事名
    var storyName: String? = null

    // 故事分值
    var rewardsScore: Int? = null

    // 开启游戏的分值，只有获得超过这个分值才能玩这个游戏
    var cutoffScore: Int? = null

    // 故事性别
    var gender: Gender? = null

    // 当前角色形象图片
    var image: String? = null

    // 故事简介
    var introduction: String? = null

    // 封面
    var cover: String? = null
    var coverDark: String? = null

    // 是否被锁定
    var unlocked: Boolean? = null

    // 章节进度
    @JsonSerialize(using = ToStringSerializer::class)
    var chapterId: Long? = null

    // 状态
    var status: GameStatus? = null

    /**
     * 用户是否收藏这个故事
     */
    var collected: Boolean? = null

    // 通关文案
    var passedCopywriting: String? = null

    // 通关图片
    var passedPicture: String? = null

    // 故事失败的文案
    var failureCopywriting: String? = null

    // 故事失败的图片
    var failurePicture: String? = null

    // 章节名称
    var chapterName: String? = null

    // 当前章节进程
    var chapterProcess: Double? = null

    // 当前故事进程
    var storyProcess: Double? = null

    var backgroundPicture: String? = null
    var backgroundPictureDark: String? = null

    // 友好度
    var friendDegree: Int? = null

    var category: List<CategoryVo>? = null
}
