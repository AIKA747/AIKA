package com.parsec.aika.common.model.vo.resp

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 */
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.AuthorType
import java.io.Serializable
import java.time.LocalDateTime


open class GetAuthorResp : Serializable {
    // 帖子唯一标识
    var id: Int? = null

    // 作者头像地址
    var avatar: String? = null

    // 显示的昵称
    var nickname: String? = null

    // @的用户名
    var username: String? = null

    // 用户的数字ID
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    // 类型（USER、BOT枚举，这里暂用字符串表示，可按需优化为枚举类型）
    var type: AuthorType? = null

    // 帖子创建时间
    var createdAt: LocalDateTime? = null

    // 帖子更新时间
    var updatedAt: LocalDateTime? = null

    var followed: Boolean? = null

    var bio: String? = null

}
