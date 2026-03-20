package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import java.time.LocalDateTime

@TableName("t_post_report_author")
class PostReportAuthor {

    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = null

    var reportId: Int? = null

    var postId: Int? = null

    var author: Long? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

}
