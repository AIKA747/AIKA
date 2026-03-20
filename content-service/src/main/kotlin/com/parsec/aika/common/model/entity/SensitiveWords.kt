package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.*
import java.time.LocalDateTime

@TableName("t_sensitive_words")
class SensitiveWords {

    @TableId(type = IdType.AUTO)
    var id: Int? = null

    /**
     * 敏感词
     */
    var word: String? = null

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    var createdAt: LocalDateTime? = null

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    var updatedAt: LocalDateTime? = null

    /**
     * 是否删除
     */
    @TableLogic(value = "0", delval = "1")
    var deleted: Boolean? = null

}