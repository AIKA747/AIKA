package com.parsec.aika.common.model.entity

import javax.validation.constraints.NotEmpty

/**
 * @author husu
 * @version 1.0
 * @date 2024/12/17.
 */
data class BotImage(
    // 封面图片地址
    @NotEmpty(message = "cover not null")
    var cover: String ?= null,
    @NotEmpty(message = "avatar not null")
    // 头像图片地址
    var avatar: String ?= null
)
