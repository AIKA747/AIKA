package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.CollectionType

class BotCollectionResp {
    @field:JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null
    var createdAt: String? = null

    @field:JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null
    var updatedAt: String? = null

    @field:JsonSerialize(using = ToStringSerializer::class)
    var updater: Long? = null
    var type: CollectionType? = null
    var avatar: String? = null
    var collectionName: String? = null

    @field:JsonSerialize(using = ToStringSerializer::class)
    var category: Long? = null

    var botCount: Int? = null
}
