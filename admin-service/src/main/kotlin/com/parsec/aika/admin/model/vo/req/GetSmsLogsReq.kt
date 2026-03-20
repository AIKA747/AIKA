package com.parsec.aika.admin.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

class GetSmsLogsReq: PageVo() {
    var phone: String? = null
    var status: Boolean? = null
    var minSendTime: String? = null
    var maxSendTime: String? = null
    var content: String? = null
}