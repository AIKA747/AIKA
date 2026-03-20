package com.parsec.aika.common.model.vo.req

import jakarta.validation.constraints.NotNull

/**
 * @author husu
 * @version 1.0
 * @date 2025/1/3.
 */
class PutAppFollowAuthorReq {
    @NotNull(message = "ID can not be null")
    var id:Int?=null
}
