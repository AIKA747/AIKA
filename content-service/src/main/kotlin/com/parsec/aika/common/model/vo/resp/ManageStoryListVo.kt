package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.StoryStatus
import java.time.LocalDateTime

class ManageStoryListVo {
    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    // 故事名
    var storyName: String? = null

    // 故事分值
    var rewardsScore: Int? = null

    // 开启游戏分值条件
    var cutoffScore: Int? = null

    // 是否被锁定
    var locked: Boolean? = null

    // 故事性别
    var gender: Gender? = null

    // 当前角色形象图片
    var image: String? = null

    // 故事简介
    var introduction: String? = null

    // 封面
    var cover: String? = null

    // 状态
    var status: StoryStatus? = null

    var createdAt: LocalDateTime? = null
}
