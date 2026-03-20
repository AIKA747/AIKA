package com.parsec.aika.order.model.vo.resp


class GetSubDataResp {

    /**
     * 当天新增订阅者数量
     */
    var newSubscribers: Int? = null

    /**
     * 当天过期的订阅者数量
     */
    var expiredSubscribers: Int? = null

    /**
     * 订阅者总数量
     */
    var totalSubscribers: Int? = null

    /**
     * 即将过期订阅者数量,7天后过期得用户数量
     */
    var upcomingExpiringSubscribers: Int? = null

    /**
     * 已过期用户总数量
     */
    var totalExpiredSubscribers: Int? = null

}