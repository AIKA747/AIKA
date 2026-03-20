package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.CollectionType
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

data class CreateBotCollectionItemRequest(
    /**
     * 机器人id
     */
    @field:NotNull(message = "botId is required")
    val botId: Long?,

    /**
     * 机器人类型：TALES、EXPERT、GAME
     */
    @field:NotNull(message = "type is required")
    val type: CollectionType?,

    /**
     * 集合id
     */
    @field:NotNull(message = "collectionId is required")
    val collectionId: Long?,

    /**
     * 图标
     */
    @field:NotEmpty(message = "avatar is required")
    val avatar: String?,

    /**
     * 机器人名称
     */
    @field:NotEmpty(message = "name is required")
    val name: String?,

    /**
     * 描述
     */
    @field:NotEmpty(message = "description is required")
    val description: String?,

    /**
     * 列表封面
     */
    @field:NotEmpty(message = "listCover is required")
    val listCover: String?,


    val listCoverDark: String?
)
