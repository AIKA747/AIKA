package com.parsec.aika.admin.model.vo.resp

class GetAdminAnalyticsSubscribersNumResp {
    /**
     * 总用户数
     */
    var totalUsers: Int? = null
    /**
     * 订阅者总数
     */
    var totalSubscribers: Int? = null
    /**
     * 即将过期订阅者数量
     */
    var upcomingExpiringSubscribers: Int? = null
    /**
     * 总订阅者过期数
     */
    var totalExpiredSubscribers: Int? = null

    var totalWowChange: String? = null
    var totalDodChange: String? = null

}