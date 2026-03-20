package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.em.ActionType
import com.parsec.aika.common.model.em.AuthorType
import jakarta.validation.constraints.NotNull


data class PostAppFollowAuthorReq(
    @NotNull var followingId: Long? = null, @NotNull var type: AuthorType? = null, var actionType: ActionType? = null
)
