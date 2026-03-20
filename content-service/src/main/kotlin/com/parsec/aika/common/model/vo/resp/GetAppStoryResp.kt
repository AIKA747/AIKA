package com.parsec.aika.common.model.vo.resp

import com.alibaba.fastjson.annotation.JSONField
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.util.LongListToStringListSerializer

/**
 * @author RainLin
 * @since 2024/1/26 11:31
 */
@Translate(fields = ["storyName"])
class GetAppStoryResp {
    // 故事id
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    // 故事名
    var storyName: String? = null

    // 故事分值
    var rewardsScore: Int? = null

    // 是否被锁定
    var locked: Boolean? = null

    // 故事性别
    var gender: Gender? = null

    // 当前角色形象图片
    var image: String? = null

    // 故事简介
    var introduction: String? = null

    // 列表封面
    var listCover: String? = null
    var listCoverDark: String? = null

    // 章节进度
    var storyProcess: Double? = null

    // 状态
    var status: GameStatus? = null

    //用户分数
    var reward: Int? = null

    //故事开始需达到得分数
    var cutoffScore: Int? = null

    //是否收藏
    var collected: Boolean? = null

    //故事分类
    @JSONField(serializeUsing = LongListToStringListSerializer::class)
    var categoryId: List<Long> ?= null

    var processCover: String? = null
}
