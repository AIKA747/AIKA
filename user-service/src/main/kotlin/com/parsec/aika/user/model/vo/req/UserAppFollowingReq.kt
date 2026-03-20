package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

/**
 * 关注我的用户列表
 */
class UserAppFollowingReq : PageVo() {

    /**
     * 用户姓名
     */
    var username: String? = null

    var userId: Long? = null
}