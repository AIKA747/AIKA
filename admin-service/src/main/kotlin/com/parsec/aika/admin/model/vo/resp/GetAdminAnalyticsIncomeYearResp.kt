package com.parsec.aika.admin.model.vo.resp

class GetAdminAnalyticsIncomeYearResp {
    /**
     * 新增收入,今年
     */
    var income: Int? = null
    /**
     * 年同比变化百分比，例子：12%，本年比较去年
     */
    var yoyChange: String? = null
    /**
     * 历史所有平均每年 收入
     */
    var annualIncome: Int? = null
}