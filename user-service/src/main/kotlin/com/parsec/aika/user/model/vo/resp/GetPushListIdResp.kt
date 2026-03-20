package com.parsec.aika.user.model.vo.resp

import java.time.LocalDateTime

class GetPushListIdResp : GetPushListsResp() {
    var updatedAt: LocalDateTime? = null
}