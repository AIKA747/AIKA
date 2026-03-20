package com.parsec.aika.content.model.vo.req

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.StoryStatus
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

class ManageStoryUpdateVo {

    // 故事id
    @NotNull(message = "故事id不能为空")
    var id: Long? = null

    // 故事名
    @NotBlank(message = "故事名称不能为空")
    var storyName: String? = null

    // 故事分值
    @NotNull(message = "故事分值不能为空")
    var rewardsScore: Int? = null

    // 开启游戏分值条件
    @NotNull(message = "开启游戏分值条件不能为空")
    var cutoffScore: Int? = null

    // 故事性别
    @NotNull(message = "故事性别不能为空")
    var gender: Gender? = null

    // 默认角色形象图片
    @NotBlank(message = "默认形象不能为空")
    var defaultImage: String? = null

    // 故事简介
    @NotBlank(message = "故事简介不能为空")
    var introduction: String? = null

    // 封面
//    @NotBlank(message = "故事封面不能为空")
    var cover: String? = null
    var coverDark: String? = null

    // 列表封面
//    @NotBlank(message = "故事列表封面不能为空")
    var listCover: String? = null
    var listCoverDark: String? = null

    // 故事失败的文案
    @NotBlank(message = "故事失败文案不能为空")
    var failureCopywriting: String? = null

    // 故事失败的图片
    @NotBlank(message = "故事失败图片不能为空")
    var failurePicture: String? = null

    // 故事状态
    var status: StoryStatus? = null

    // 标签，逗号分隔
    var tags: String? = null

    /**
     * 故事任务信息
     */
    var taskIntroduction: String? = null

    //默认背景图片
    var defaultBackgroundPicture: String? = null
    var defaultBackgroundPictureDark: String? = null

    @NotNull(message = "category not null")
    var categoryId: List<Long>? = null

    var processCover: String? = null

    var salutationContent: String? = null
}
