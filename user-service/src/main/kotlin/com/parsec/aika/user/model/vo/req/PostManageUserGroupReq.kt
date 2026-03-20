package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

class PostManageUserGroupReq {

    /**
     * groupId
     */
    @NotNull
    var userId: Long? = null

    /**
     * userIds
     */
    @NotEmpty
    var groupIds: List<Long>? = null


}