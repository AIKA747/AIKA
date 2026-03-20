package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import java.time.LocalDateTime

@TableName("t_post_blocked")
class PostBlocked {
    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = null

    /**
     * 帖子id
     */
    var postId: Int? = null

    /**
     * 创建者
     */
    var creator: Long? = null

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null


}