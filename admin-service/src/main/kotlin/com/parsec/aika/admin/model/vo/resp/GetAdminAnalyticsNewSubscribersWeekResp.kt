package com.parsec.aika.admin.model.vo.resp

class GetAdminAnalyticsNewSubscribersWeekResp {
    // 当周新增
    var newSubscribers: Int? = null
    // 周同比
    var wowChange: String? = null
    // 日新增
    var dailyNewSubscribers: Int? = null
    // 日同比
    var dodChange: String? = null
}