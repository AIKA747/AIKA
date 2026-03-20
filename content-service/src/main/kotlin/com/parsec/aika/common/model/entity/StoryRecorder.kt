package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.GameStatus

/**
 * 游戏记录表（存档）
 */
@TableName("t_story_recorder")
class StoryRecorder : BaseDomain() {

    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    // 章节id
    @JsonSerialize(using = ToStringSerializer::class)
    var chapterId: Long? = null

    // 当前章节进程
    var chapterProcess: Double? = null

    // 当前故事进程
    var storyProcess: Double? = null

    // 章节进度分
    var storyDegree: Int? = null

    // 友好度
    var friendDegree: Int? = null

    // 得分
    var reward: Int? = null

    // 状态
    var status: GameStatus? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    var preview: Boolean? = null
}