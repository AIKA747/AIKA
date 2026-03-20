package com.parsec.aika.common.model.entity

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 */
import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import java.io.Serializable
import java.time.LocalDateTime

@TableName("t_shortcut")
data class Shortcut(
    // 主键ID
    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = 0,
    // 创建时间，使用LocalDateTime类型便于处理日期时间相关逻辑
    var createdAt: LocalDateTime? = null,
    // 创建人ID
    var creator: Int? = null,
    // 更新时间，同样使用LocalDateTime类型，后续可按业务需求准确赋值
    var updatedAt: LocalDateTime? = null,
    // 数据版本号，每次更新加1
    var dataVersion: Int = 0,
    // 是否删除的标识，布尔类型表示
    var deleted: Boolean = false,
    // 更新人ID
    var updater: Int = 0,
    // 用户的ID
    var userId: Int = 0,
    // 创作者（置顶的创作者）的ID
    var authorId: Int = 0
) : Serializable
