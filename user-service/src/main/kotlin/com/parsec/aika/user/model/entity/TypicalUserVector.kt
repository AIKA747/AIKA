package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.parsec.aika.user.model.em.InterestItemType

/**
 * @author husu
 * @version 1.0
 * @date 2025/4/29.
 */
@TableName("typical_user_vector", autoResultMap = true)
class TypicalUserVector {
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    var id: Long? = null

    @TableField(typeHandler = JacksonTypeHandler::class)
    var vector: Map<String, Int>? = null

    var distance: Double? = null

    var type: InterestItemType? = null
}
