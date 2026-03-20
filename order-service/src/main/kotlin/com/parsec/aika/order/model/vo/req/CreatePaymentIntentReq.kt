package com.parsec.aika.order.model.vo.req

import javax.validation.constraints.NotBlank

class CreatePaymentIntentReq {

    @NotBlank
    var orderNo: String? = null

}