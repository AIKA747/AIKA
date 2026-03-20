package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.StoryStatus
import com.parsec.aika.common.model.vo.resp.CategoryVo
import com.parsec.aika.common.util.LongListToStringListSerializer
import java.io.Serializable
import java.time.LocalDateTime

/**
 * 故事表
 */
@TableName("t_story", autoResultMap = true)
open class Story : Serializable {

    // 故事名称
    var storyName: String? = null

    // 故事分值
    var rewardsScore: Int? = null

    // 开启游戏分值条件
    var cutoffScore: Int? = null

    // 故事角色性别
    var gender: Gender? = null

    // 默认形象
    var defaultImage: String? = null

    // 简介
    var introduction: String? = null

    // 封面
    var cover: String? = null
    var coverDark: String? = null

    // 列表封面
    var listCover: String? = null
    var listCoverDark: String? = null

    // 故事失败的文案
    var failureCopywriting: String? = null

    // 故事失败的图片
    var failurePicture: String? = null

    // 状态
    var status: StoryStatus? = null

    // 标签，逗号分隔
    var tags: String? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    @JsonSerialize(using = ToStringSerializer::class)
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null // 创建时间


    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null // 修改时间


    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null

    @TableLogic(value = "0", delval = "1")
    var deleted: Boolean? = null

    @TableField(exist = false)
    var recorderUserId: Long? = null

    /**
     * 故事任务信息
     */
    var taskIntroduction: String? = null

    @TableField(exist = false)
    var userCount: Int? = null

    //默认背景图片
    var defaultBackgroundPicture: String? = null
    var defaultBackgroundPictureDark: String? = null

    //故事分类
    @JsonSerialize(using = LongListToStringListSerializer::class)
    @TableField(typeHandler = JacksonTypeHandler::class)
    var categoryId: List<Long>? = null

    @TableField(exist = false)
    var category: List<CategoryVo>? = null

    var processCover: String? = null

    var salutationContent: String? = null
}
