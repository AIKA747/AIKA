package com.parsec.aika.order.model.vo.req

import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.vo.PageVo
import java.time.LocalDateTime

class GetManageOrdersReq: PageVo() {
    var orderNo: String? = null
    var username: String? = null
    var email: String? = null
    var phone: String? = null
    var status: OrderStatusEnum? = null
    var minCreatedAt: String? = null
    var maxCreatedAt: String? = null
    var payMethod: PayMethodEnum? = null
    var minPayTime: String? = null
    var maxPayTime: String? = null
}