package com.parsec.aika.common.model.vo.req

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

class ApiEstimatedWeightReq {

    @NotBlank
    var productDescription: String? = null

    @NotNull
    var timestamp: Long? = null

}
