package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.GameStatus

/**
 * @author RainLin
 * @since 2024/1/26 11:31
 */
class PostAppStoryRecorderResp{

    // 章节id
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    // 章节名称
    var chapterName: String? = null

    // 此章节形象
    var image: String? = null

    // 章节封面（通关或失败的图片）
    var picture: String? = null

    // 文案（显示上一个章节的通关文案或者）
    var copywriting: String? = null

    // 状态
    var status: GameStatus? = null
}
