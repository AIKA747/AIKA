package com.parsec.aika.common.model.entity

import java.io.Serializable

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 */
data class ThreadContent(
    // 内容节点标题
    var title: String = "",
    // 内容节点正文内容
    var content: String = "",
    // 内容节点包含的图片地址列表
    var images: List<String?> = emptyList()
) : Serializable
