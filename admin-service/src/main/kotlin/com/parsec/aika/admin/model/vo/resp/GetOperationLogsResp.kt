package com.parsec.aika.admin.model.vo.resp

import java.time.LocalDateTime

class GetOperationLogsResp {
    var adminName: String? = null
    var module: String? = null
    var record: String? = null
    var initialValue: String? = null
    var finalValue: String? = null
    var operatedTime: LocalDateTime? = null
    var action: String? = null
}