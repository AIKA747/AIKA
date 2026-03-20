package com.parsec.aika.order.model.vo.req

import javax.validation.constraints.NotBlank

class CheckApplePayReq {

    var test: Boolean? = false

    @NotBlank
    var receipt: String? = null

    @NotBlank
    var payNo: String? = null

    @NotBlank
    var transactionId: String? = null

}