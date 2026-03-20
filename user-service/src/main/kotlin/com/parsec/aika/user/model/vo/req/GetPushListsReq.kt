package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

open class GetPushListsReq : PageVo() {
    var title: String? = null
    var content: String? = null
    var operator: String? = null
    var minPushTime: String? = null
    var maxPushTime: String? = null
}