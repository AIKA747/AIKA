package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

open class ListBlockedUserReq : PageVo() {
    var userId: Long? = null
}