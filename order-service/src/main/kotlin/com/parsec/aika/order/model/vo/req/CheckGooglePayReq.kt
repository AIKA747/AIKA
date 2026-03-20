package com.parsec.aika.order.model.vo.req

import javax.validation.constraints.NotBlank

class CheckGooglePayReq {
    /**
     * 发起支付时返回的支付单号
     */
    @NotBlank
    var payNo: String? = null

    var packageName: String? = null
    @NotBlank
    var productId: String? = null
    @NotBlank
    var purchaseToken: String? = null
}