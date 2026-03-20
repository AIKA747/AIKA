package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

/**
 * 游戏的加分减分记录
 */
@TableName("t_play_log")
class StoryPlayLog : BaseDomain() {
    // 游戏记录表id
    @JsonSerialize(using = ToStringSerializer::class)
    var storyRecorderId: Long? = null

    // 每个礼物增加的友好分
    var friendDegree: Int? = null

    // 每个礼物增加的情节分
    var storyDegree: Int? = null

    // 章节id，可以为空，为空表示故事通用
    @JsonSerialize(using = ToStringSerializer::class)
    var chapterId: Long? = null

    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    // 用户引起加分或者减分的那句话，如果是送礼物，就显示 gift
    var reason: String? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null
}