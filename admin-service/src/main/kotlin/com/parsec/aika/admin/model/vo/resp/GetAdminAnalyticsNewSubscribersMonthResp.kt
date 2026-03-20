package com.parsec.aika.admin.model.vo.resp

class GetAdminAnalyticsNewSubscribersMonthResp {
    /**
     * 新增用户数,1日～当日
     */
    var newSubscribers: Int? = null
    /**
     * 月同比变化百分比，例子：12%，本月比较上月
     */
    var momChange: String? = null
    /**
     * 月新增订阅，历史所有平均每月
     */
    var monthlyNewSubscribers: Int? = null
}