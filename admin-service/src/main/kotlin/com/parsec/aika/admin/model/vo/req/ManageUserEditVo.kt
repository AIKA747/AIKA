package com.parsec.aika.admin.model.vo.req

import javax.validation.constraints.NotNull

class ManageUserEditVo {

    /**
     * id
     */
    var id: Long? = null

    /**
     * 昵称
     */
    @NotNull
    var nickname: String? = null

    /**
     * 账户
     */
    @NotNull
    var username: String? = null

    /**
     * 头像
     */
    var avatar: String? = null

    /**
     * 角色id
     */
    @NotNull
    var roleId: Long? = null

}