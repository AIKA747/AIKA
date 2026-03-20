package com.parsec.aika.common.model.entity

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 * 点赞记录
 */
import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import java.io.Serializable
import java.time.LocalDateTime

@TableName("t_thumb")
data class Thumb(
    // 点赞记录的唯一标识ID
    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = null,
    // 关联的文章（帖子）ID
    var postId: Int? = null,
    // 点赞人的ID
    var creator: Long? = null,
    // 点赞记录的创建时间，使用LocalDateTime便于处理日期时间相关逻辑
    var createdAt: LocalDateTime? = null
) : Serializable
