package com.parsec.aika.common.model.entity

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 */
import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableLogic
import com.baomidou.mybatisplus.annotation.TableName
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.UserStatus
import java.io.Serializable
import java.time.LocalDateTime

@TableName("t_author")
data class Author(
    // 作者唯一标识
    @TableId(value = "id", type = IdType.AUTO) var id: Int = 0,
    // 作者头像地址
    var avatar: String? = null,
    // 显示的昵称
    var nickname: String? = null,
    // @的用户名
    var username: String? = null,
    // 用户的数字ID
    var userId: Long = 0,
    // 类型（USER、BOT枚举，这里暂用字符串表示，可按需优化为枚举类型）
    var type: AuthorType? = null,
    //性别：MALE, HIDE, FEMALE
    var gender: Gender? = null,
    //用户状态：unverified, uncompleted, enabled, disabled
    var status: UserStatus? = null,
    // 创建时间，这里可根据实际业务调整日期时间类型处理更准确的赋值等操作
    var createdAt: LocalDateTime = LocalDateTime.now(),
    // 更新时间，同理可完善相关时间处理逻辑
    var updatedAt: LocalDateTime = LocalDateTime.now(),
    //流行度
    var pop: Double? = null, var popUpdatedAt: LocalDateTime? = null,

    var bio: String? = null,
    //作者敏感帖子敏感数清空时间
    var caseCleanAt: LocalDateTime? = null, @TableLogic(value = "0", delval = "1") var deleted: Boolean? = null
) : Serializable
