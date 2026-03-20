package com.parsec.aika.user.model.vo.resp

import cn.hutool.json.JSONArray
import com.parsec.aika.common.model.bo.NotifyType
import com.parsec.aika.user.domain.NotifyMetadata
import java.time.LocalDateTime

class AppNotifyResp {

    var id: Int? = null

    var type: NotifyType? = null

    var cover: String? = null

    var number: Int? = null

    var authors: JSONArray? = null

    var metadata: NotifyMetadata? = null

    var readFlag: Boolean? = null

    var createdAt: LocalDateTime? = null

    var groupById: String? = null


}