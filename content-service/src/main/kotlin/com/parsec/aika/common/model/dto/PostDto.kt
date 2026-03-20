package com.parsec.aika.common.model.dto

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.entity.ThreadContent
import java.time.LocalDateTime

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/15.
 */
class PostDto {
    // 帖子内容，对应复杂的数组嵌套对象结构
    var thread: List<ThreadContent>? = null

    // 帖子唯一标识
    var id: Int? = null

    // 帖子标题
    var title: String? = null

    // 帖子封面图片地址，冗余字段取thread里首张图片
    var cover: String? = null

    // 主题标签，用逗号隔开的字符串形式
    var topicTags: String? = null

    // 帖子创建时间
    var createdAt: LocalDateTime? = null

    // 帖子更新时间
    var updatedAt: LocalDateTime? = null

    // 作者ID，这里是userId，而不是Author对象的ID，它和下面的type构成了作者的唯一标识
    @JsonSerialize(using = ToStringSerializer::class)
    var author: Long? = null

    // 类型（BOT或USER枚举，这里简单用字符串表示，可根据实际优化为枚举类型）
    var type: AuthorType? = null

    // 点赞数
    var likes: Int? = null

    // 回复数
    var reposts: Int? = null

    // 访问数
    var visits: Int? = null

    // 摘要内容，取thread第一个节点内容
    var summary: String? = null

    // 关键字，逗号隔开的字符串
    var keywords: String? = null

    // 系统推荐标签，逗号隔开的字符串
    var recommendTags: String? = null

    var nickname: String? = null

    var avatar: String? = null

    /**
     * 当前用户是否点赞
     */
    var thumbed: Boolean? = null
}
