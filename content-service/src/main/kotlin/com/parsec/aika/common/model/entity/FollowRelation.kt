package com.parsec.aika.common.model.entity

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 */
import com.baomidou.mybatisplus.annotation.*
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.parsec.aika.common.model.em.AuthorType
import java.io.Serializable
import java.time.LocalDateTime

@TableName("t_follow_relation", autoResultMap = true)
data class FollowRelation(
    // 主键ID
    @TableId(value = "id", type = IdType.AUTO)
    var id: Int = 0,
    // 创建时间，使用LocalDateTime类型便于更好地处理日期时间相关逻辑
    var createdAt: LocalDateTime = LocalDateTime.now(),
    // 更新时间，同样使用LocalDateTime类型，后续可按业务需求准确赋值
    var updatedAt: LocalDateTime = LocalDateTime.now(),
    // 数据版本号，每次更新加1
    var dataVersion: Int = 0,
    // 是否删除的标识，布尔类型表示
    @TableLogic(delval = "1", value = "0")
    var deleted: Boolean = false,
    // 创建人ID
    var creator: Long? = null,
    // 关注对象的ID（可以是机器人或人类的ID）
    var followingId: Long? = null,
    // 类型（BOT和USER的枚举情况，这里暂用字符串表示，可按需优化为枚举类）
    var type: AuthorType? = null,
    // 是否已同意关注的标识，布尔类型
    var agreed: Boolean = false,
    // 机器人的形象相关信息，包含封面和头像地址等
    @TableField(typeHandler = JacksonTypeHandler::class)
    var botImage: BotImage? = null
) : Serializable

