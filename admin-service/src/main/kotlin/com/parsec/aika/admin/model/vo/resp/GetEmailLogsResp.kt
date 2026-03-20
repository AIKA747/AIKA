package com.parsec.aika.admin.model.vo.resp

import java.time.LocalDateTime

class GetEmailLogsResp {
    var email: String? = null
    var content: String? = null
    var status:  String? = null
    var sendTime: LocalDateTime? = null
}