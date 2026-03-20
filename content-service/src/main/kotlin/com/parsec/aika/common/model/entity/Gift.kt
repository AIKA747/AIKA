package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.io.Serializable
import java.time.LocalDateTime

/**
 * 礼物
 */
@TableName("t_gift")
class Gift : Serializable {
    // 礼物名称
    var giftName: String? = null

    // 每个礼物增加的友好分
    var friendDegree: Int? = null

    // 每个礼物增加的情节分
    var storyDegree: Int? = null

    // 用户id
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    // 故事id，可以为空，为空表示全局通用
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    var image: String? = null

    // 章节id，可以为空，为空表示故事通用
    @JsonSerialize(using = ToStringSerializer::class)
    var chapterId: Long? = null

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
}