package com.parsec.aika.bot.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.CollectionType

class BotCollectionItemResp {
    @field:JsonSerialize(using = ToStringSerializer::class)
    var id: Long ?= null
    @field:JsonSerialize(using = ToStringSerializer::class)
    var collectionId: Long ?= null
    @field:JsonSerialize(using = ToStringSerializer::class)
    var botId: Long ?= null
    var createdAt: String ?= null
    @field:JsonSerialize(using = ToStringSerializer::class)
    var creator: Long ?= null
    var updatedAt: String ?= null
    @field:JsonSerialize(using = ToStringSerializer::class)
    var updater: Long ?= null
    var type: CollectionType ?= null
    var avatar: String ?= null
    var name: String ?= null
    var description: String ?= null
    var listCover: String ?= null
}
