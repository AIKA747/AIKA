package com.parsec.aika.common.model.vo.req

import jakarta.validation.constraints.NotNull

class StoryPreviewReq {

    @NotNull
    var storyId: Long? = null

    @NotNull
    var chapterId: Long? = null
}
