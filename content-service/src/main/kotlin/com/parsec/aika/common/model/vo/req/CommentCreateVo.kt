package com.parsec.aika.common.model.vo.req

import jakarta.validation.constraints.NotNull

class CommentCreateVo {

    var id: Int? = null

    var content: String? = null

    // 语音对应的链接（可为空，若不存在语音则为空字符串）
    var voiceUrl: String? = null

    @NotNull(message = "postId not null")
    var postId: Int? = null

    var fileProperty: String? = null

    var replyCommontInfo: String? = null

}
