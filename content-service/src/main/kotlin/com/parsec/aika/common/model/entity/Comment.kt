package com.parsec.aika.common.model.entity

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 */
import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.AuthorType
import java.io.Serializable
import java.time.LocalDateTime

@TableName("t_comment", autoResultMap = true)
class Comment : Serializable {
    // 评论的唯一标识ID
    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = null

    // 评论的具体内容, 回复格式为"@(username)"
    var content: String? = null

    // 语音对应的链接（可为空，若不存在语音则为空字符串）
    var voiceUrl: String? = null

    // 关联的帖子ID
    var postId: Int? = null

    // 评论创建者（发帖人）的ID
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    // 评论创建时间，使用LocalDateTime类型方便日期时间处理
    var createdAt: LocalDateTime? = null

    // 评论更新时间，同样使用LocalDateTime类型，实际中按需准确赋值
    var updatedAt: LocalDateTime? = null

    // 评论中@的用户名（Author.username）列表，可为空
    @TableField(typeHandler = JacksonTypeHandler::class)
    var replyTo: List<String>? = null

    // 用户类型
    var type: AuthorType? = null
    var fileProperty: String? = null
    var replyCommontInfo: String? = null
}
