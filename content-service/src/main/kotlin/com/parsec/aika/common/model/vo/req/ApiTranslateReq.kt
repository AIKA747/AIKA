package com.parsec.aika.common.model.vo.req

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

class ApiTranslateReq {

    @NotBlank
    var text: String? = null

    @NotNull
    var timestamp: Long? = null

    /**
     * 默认翻译为俄语
     */
    var language: String? = null

}
