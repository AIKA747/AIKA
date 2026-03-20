package com.parsec.aika.common.model.vo.resp

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.AuthorType
import java.io.Serializable
import java.time.LocalDateTime

class ManagePostListResp : Serializable {
    /**
     * id
     */
    var id: Int? = null

    /**
     * 作者id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var author: Long? = null

    /**
     * 作者名称
     */
    var authorName: String? = null

    /**
     * 作者头像
     */
    var authorAvatar: String? = null

    /**
     * 是否屏蔽
     */
    var blocked: Boolean? = null

    /**
     * 封面
     */
    var cover: String? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null

    /**
     * 关键词
     */
    var keywords: String? = null

    /**
     * 标签
     */
    var recommendTags: String? = null

    /**
     * 摘要
     */
    var summary: String? = null

    /**
     * 标题
     */
    var title: String? = null

    /**
     * BOT 还是 USER 枚举
     */
    var type: AuthorType? = null

    //是否敏感
    var flagged: Boolean? = null

    //敏感标签集合
    var categories: List<String>? = null
}