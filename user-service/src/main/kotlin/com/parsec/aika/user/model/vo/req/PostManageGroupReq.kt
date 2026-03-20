package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotNull


class PostManageGroupReq {

    /**
     * name
     */
    @NotNull(message = "用户组名称不能为空")
    var groupName: String? = null
}