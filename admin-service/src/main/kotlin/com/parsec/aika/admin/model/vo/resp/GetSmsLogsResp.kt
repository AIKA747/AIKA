package com.parsec.aika.admin.model.vo.resp

import java.time.LocalDateTime

class GetSmsLogsResp {
    var phone: String? = null
    var content: String? = null
    var status:  Boolean? = null
    var sendTime: LocalDateTime? = null
}