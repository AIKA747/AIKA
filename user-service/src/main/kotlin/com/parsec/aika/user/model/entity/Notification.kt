package com.parsec.aika.user.domain

import com.baomidou.mybatisplus.annotation.*
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.bo.NotifyType
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.user.model.em.Gender
import java.io.Serializable
import java.time.LocalDateTime

/**
 * 用户通知表
 * @TableName notification
 */
@TableName(value = "notification", autoResultMap = true)
class Notification : Serializable {
    /**
     * 通知id
     */
    @TableId(type = IdType.AUTO)
    var id: Integer? = null

    /**
     * 通知类型：点赞通知（thumb）、关注的用户发帖通知（post）、被@通知（at）
     */
    var type: NotifyType? = null

    /**
     * 通知用户集合（使用逗号分隔）
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var userIds: List<Long>? = null

    /**
     * 作者用户id
     */
    var authorId: Long? = null

    /**
     * 作者头像（点赞用户的）
     */
    var avatar: String? = null

    /**
     * 作者昵称
     */
    var nickname: String? = null

    /**
     * 作者用户名
     */
    var username: String? = null

    /**
     * 作者性别:MALE, HIDE, FEMALE
     */
    var gender: Gender? = null

    /**
     * 封面
     */
    var cover: String? = null

    /**
     * 附带的元数据
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var metadata: NotifyMetadata? = null

    /**
     * 已读用户集合
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var readUserIds: List<NotifyReadUserId>? = null

    /**
     * 生成一个消息需要合并的标识，用于分组显示
     */
    var groupById: String? = null

    /**
     * 通知创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 最后一次更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null

    /**
     * 数据版本，每更新一次+1
     */
    @Version
    @TableField(fill = FieldFill.INSERT)
    var dataVersion: Int? = null
}

class NotifyMetadata {
    //帖子id
    var postId: String? = null

    //帖子摘要内容
    var summary: String? = null

    //点赞数
    var likes: Int? = null

    //回复数
    var reposts: Int? = null

    //评论id
    var commentId: String? = null

    //评论内容
    var content: String? = null

    //作者类型
    var type: AuthorType? = null

}

class NotifyReadUserId {
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null
    var readAt: String? = null
}