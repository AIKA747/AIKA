package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.IdType
import com.baomidou.mybatisplus.annotation.TableId
import com.baomidou.mybatisplus.annotation.TableName
import java.io.Serializable
import java.time.LocalDateTime

@TableName("t_post_index")
data class PostIndex(


    // 主键ID
    @TableId(value = "id", type = IdType.AUTO)
    var id: Int? = null,

    var postId: Int? = null,

    // 帖子的摘要
    var summary: String? = null,

    // 多个keyword用逗号隔开
    var keywords: String? = null,

    // thread 数组的索引，默认为0
    var threadIndex: Int = 0,

    // 创建时间
    var createdAt: LocalDateTime? = null,

    // 更新时间
    var updatedAt: LocalDateTime? = null,

    // 数据版本号，每次更新加1
    var dataVersion: Int = 0,

    // 是否删除的标识，布尔类型表示
    var deleted: Boolean = false

) : Serializable
