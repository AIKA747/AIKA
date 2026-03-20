package com.parsec.aika.common.model.vo.req

import jakarta.validation.constraints.NotBlank

class ManageCategoryReq {

    @NotBlank
    var name: String? = null

    var weight: Int? = 0

    var id: Long? = null

}
