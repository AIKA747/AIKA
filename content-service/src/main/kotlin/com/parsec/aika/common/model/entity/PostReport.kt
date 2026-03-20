package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import com.parsec.aika.common.aspect.Translate
import java.time.LocalDateTime

@Translate(fields = ["title", "description"])
@TableName("t_post_report")
class PostReport {

    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = null

    var title: String? = null

    var description: String? = null

    var sortNo: Int? = null

    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null

    @TableLogic(value = "0", delval = "1")
    var deleted: Boolean? = null


}