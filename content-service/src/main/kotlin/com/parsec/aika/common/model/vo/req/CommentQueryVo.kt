package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.vo.PageVo
import org.jetbrains.annotations.NotNull

class CommentQueryVo : PageVo() {

    /**
     * 文章ID
     */
    @NotNull(value = "postId can not be null")
    var postId: Int? = null

    var loginUserId: Long? = null

    var blockedUserIdList: List<Long>? = null

    var keywords: String? = null
}
