package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.CollectionType


class GetAppBotCollectionResp {
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var type: CollectionType? = null
    var avatar: String? = null
    var collectionName: String? = null

    @JsonSerialize(using = ToStringSerializer::class)
    var category: Long? = null

}
