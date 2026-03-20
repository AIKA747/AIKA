package com.parsec.aika.admin.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

class GetEmailLogsReq: PageVo() {
    var email: String? = null
    var status: String? = null
    var minSendTime: String? = null
    var maxSendTime: String? = null
    var content: String? = null

}