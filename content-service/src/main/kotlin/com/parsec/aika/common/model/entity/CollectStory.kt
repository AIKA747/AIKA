package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

/**
 * 用户收藏故事中间表
 */
@TableName("t_collect_story")
class CollectStory : BaseDomain() {
    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    // 用户id
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null
}