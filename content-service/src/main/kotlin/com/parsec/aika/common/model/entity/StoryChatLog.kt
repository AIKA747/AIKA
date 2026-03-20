package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.ContentType
import com.parsec.aika.common.model.em.MsgStatus
import com.parsec.aika.common.model.em.SourceTypeEnum
import java.io.Serializable
import java.time.LocalDateTime

@TableName("t_story_chat_log")
class StoryChatLog : Serializable {
    /**
     * id，主键id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    /**
     * 故事id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var storyId: Long? = null

    /**
     * 故事存档id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var storyRecorderId: Long? = null

    /**
     * 章节id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var chapterId: Long? = null

    /**
     * 说话者：user,robot
     */
    var sourceType: SourceTypeEnum? = null

    /**
     * 说话内容
     */
    var textContent: String? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    /**
     * 记录类型：'TEXT','VOICE','IMAGE','VIDEO','botRecommend','storyRecommend'，gift
     */
    var contentType: ContentType? = null

    /**
     *当contentType=gift时，该字段保存的是 gift对象数据
     */
    var json: String? = null

    var media: String? = null

    /**
     * created, processing, success, fail
     */
    var msgStatus: MsgStatus? = null

    /**
     * 已读标记：0未读，1已读
     */
    var readFlag: Boolean? = null

    /**
     * 读取消息时间
     */
    var readTime: LocalDateTime? = null

    /**
     * 回复消息id
     */
    var replyMessageId: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    var fileProperty: String? = null

    var gptJson: String? = null
}