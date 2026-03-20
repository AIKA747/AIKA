package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.CollectionType
import com.parsec.trantor.mybatisplus.base.BaseDomain

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/7.
 */
@TableName("bot_collection_item")
class BotCollectionItem: BaseDomain() {



    /**
     * 更新人
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var updater: Long? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 机器人id
     */
    var botId: Long? = null

    /**
     * 机器人类型：TALES、EXPERT、GAME
     */
    var type: CollectionType? = null

    /**
     * 集合id
     */
    var collectionId: Long? = null

    /**
     * 图标
     */
    var avatar: String? = null

    /**
     * 机器人名称
     */
    var name: String? = null

    /**
     * 描述
     */
    var description: String? = null

    /**
     * 列表封面
     */
    var listCover: String? = null

    var listCoverDark: String? = null
}
