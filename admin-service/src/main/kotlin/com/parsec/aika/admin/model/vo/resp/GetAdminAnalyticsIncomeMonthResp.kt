package com.parsec.aika.admin.model.vo.resp

class GetAdminAnalyticsIncomeMonthResp {
    /**
     * 新增收入,当月
     */
    var income: Int? = null
    /**
     * 月同比变化百分比，例子：12%，本月比较去年本月
     */
    var momChange: String? = null
    /**
     * 历史所有平均每月 收入
     */
    var monthlyIncome: Int? = null
}