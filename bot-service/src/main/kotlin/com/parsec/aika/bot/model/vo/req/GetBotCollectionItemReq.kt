package com.parsec.aika.bot.model.vo.req

import com.parsec.aika.common.model.vo.PageVo
import javax.validation.constraints.NotNull


class GetBotCollectionItemReq: PageVo() {
    @NotNull(message = "collectionId cannot be null")
    @field:NotNull(message = "collectionId cannot be null")
    var collectionId: Long? = null
}
