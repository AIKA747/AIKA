package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.AuthorType
import java.io.Serializable
import java.time.LocalDateTime

/**
 * @author Zhao YinPing
 */
class CommentResp : Serializable {

    // 评论的唯一标识ID
    var id: Int? = null

    // 评论的具体内容, 回复格式为"@(username)"
    var content: String? = null

    // 语音对应的链接（可为空，若不存在语音则为空字符串）
    var voiceUrl: String? = null

    // 关联的帖子ID
    var postId: Int? = null

    // 评论创建者（发帖人）的ID
    var creator: String? = null

    // 评论创建时间，使用LocalDateTime类型方便日期时间处理
    var createdAt: LocalDateTime? = null

    // 评论更新时间，同样使用LocalDateTime类型，实际中按需准确赋值
    var updatedAt: LocalDateTime? = null

    // 评论中@的用户名（Author.username）列表，可为空
    var replyTo: List<String>? = null

    // 用户类型
    var type: AuthorType? = null
    var fileProperty: String? = null

    // 回复人头像
    var avatar: String? = null

    // 回复人昵称
    var nickname: String? = null
    var username: String? = null

    // 发帖人昵称
    var postAuthor: String? = null

    // 发帖人头像
    var postAuthorAvatar: String? = null

    // 发帖时间
    var postCreatedAt: LocalDateTime? = null

    // 帖子摘要
    var summary: String? = null

    // 帖子点赞数
    var likes: Int? = null

    // 帖子回复数
    var reposts: Int? = null

    // 发帖人ID
    @JsonSerialize(using = ToStringSerializer::class)
    var postAuthorId: Long? = null

    // 是否点赞
    var thumbed: Boolean? = null

    // 发帖人类型
    var postAuthorType: AuthorType? = null

    var replyCommontInfo: String? = null
}
