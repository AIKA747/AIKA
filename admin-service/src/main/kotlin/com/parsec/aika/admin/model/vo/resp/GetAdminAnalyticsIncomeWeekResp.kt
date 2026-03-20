package com.parsec.aika.admin.model.vo.resp

class GetAdminAnalyticsIncomeWeekResp {
    /**
     * 新增收入,当周
     */
    var income: Int? = null
    /**
     * 周同比
     */
    var wowChange: String? = null
    /**
     * 新增收入,当日
     * 每日收入。日均
     */
    var dailyIncome: Int? = null
}