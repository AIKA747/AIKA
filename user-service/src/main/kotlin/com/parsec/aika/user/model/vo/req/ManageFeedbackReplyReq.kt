package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

class ManageFeedbackReplyReq {
    /**
     * 反馈id
     */
    @NotNull
    var id: Long? = null

    /**
     * 回复内容
     */
    @NotBlank
    var replyContent: String? = null

    /**
     * 回复反馈图片集合
     */
    var replyImages: List<String>? = null
}