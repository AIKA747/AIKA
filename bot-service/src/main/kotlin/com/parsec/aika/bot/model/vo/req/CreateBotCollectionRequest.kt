package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.em.CollectionType
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class CreateBotCollectionRequest(
    val id: Long?,

    @field:NotNull(message = "type is required")
    val type: CollectionType?,

    @field:NotBlank(message = "avatar is required")
    val avatar: String?,

    @field:NotBlank(message = "collectionName is required")
    val collectionName: String?,

    @field:NotNull(message = "category is required")
    val category: Long?

)
