package com.parsec.aika.order.model.vo.req

import javax.validation.constraints.NotBlank

class InitPayMentReq {

    @NotBlank
    var orderNo: String? = null

    var successUrl: String? = null

    var failureUrl: String? = null

}