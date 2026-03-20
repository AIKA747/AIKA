package com.parsec.aika.admin.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

class GetOperationLogsReq : PageVo() {
    var username: String? = null
    var module: String? = null
    var action: String? = null
    var minOperatedTime: String? = null
    var maxOperatedTime: String? = null
    var record: String? = null
}