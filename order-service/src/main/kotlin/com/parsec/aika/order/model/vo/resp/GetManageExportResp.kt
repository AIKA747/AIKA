package com.parsec.aika.order.model.vo.resp

import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.OrderStatusEnum.*
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayMethodEnum.*

class GetManageExportResp {
    var orderNo: String? = null
    var username: String? = null
    var email: String? = null
    var phone: String? = null
    var amount: Double? = null
    var status: OrderStatusEnum? = null
    var statusStr: String? = null
        get() = when (this.status) {
            Success -> "成功"
            Cancelled -> "取消"
            Unpaid -> "未支付"
            null -> ""
        }
    var createdAt: String? = null
    var payMethod: PayMethodEnum? = null
    val payMethodStr: String
        get() = when (this.payMethod) {
            WeChat -> "微信支付"
            Alipay -> "支付宝支付"
            BankCard -> "银行卡支付"
            Stripe -> "stripe"
            Freedompay -> "freedompay"
            ApplePay -> "applepay"
            GooglePay -> "googlepay"
            ZeroPay -> "zeropay"
            null -> ""
        }
    var payNo: String? = null
    var payTime: String? = null


}