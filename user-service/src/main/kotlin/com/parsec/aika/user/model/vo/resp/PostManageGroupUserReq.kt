package com.parsec.aika.user.model.vo.resp

import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull


class PostManageGroupUserReq {

    /**
     * groupId
     */
    @NotNull
    var groupId: Long? = null

    /**
     * userIds
     */
    @NotEmpty
    var userIds: List<Long>? = null
}