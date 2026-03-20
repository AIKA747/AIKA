package com.parsec.aika.common.model.vo.resp

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 */
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.AuthorType
import java.time.LocalDateTime


open class GetAppContentPostThreadResp {
    // 帖子唯一标识
    @JsonSerialize(using = ToStringSerializer::class)
    var postId: Long? = null
    var nickname: String? = null
    var username: String? = null
    var avatar: String? = null
    var threadIndex: Int? = null
    var createdAt: LocalDateTime? = null
    var title: String? = null
    var images: List<String>? = null
    var content: String? = null

    var type: AuthorType? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var author: Long? = null
}
