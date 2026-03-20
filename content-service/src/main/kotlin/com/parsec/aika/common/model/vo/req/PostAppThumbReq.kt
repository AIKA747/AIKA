package com.parsec.aika.common.model.vo.req

import jakarta.validation.constraints.NotNull

data class PostAppThumbReq(@NotNull var postId: Int? = null, @NotNull var thumb: Boolean? = null)
