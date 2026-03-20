package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer


class GetAppBotCollectionItemResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var listCover: String? = null
    var avatar: String? = null
    var name: String? = null
    var type: String? = null
    var description: String? = null
    @JsonSerialize(using = ToStringSerializer::class)
    var botId: Long? = null
    @JsonSerialize(using = ToStringSerializer::class)
    var collectionId: Long? = null
    var listCoverDark:String? = null
}
