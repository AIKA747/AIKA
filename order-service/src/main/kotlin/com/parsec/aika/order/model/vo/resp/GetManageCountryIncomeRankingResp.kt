package com.parsec.aika.order.model.vo.resp

import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.vo.PageVo
import java.time.LocalDateTime

class GetManageCountryIncomeRankingResp {
    var country: String? = null
    var data: Double? = null
}