package com.parsec.aika.admin.model.vo.resp

class StatisticsTotalUsersResp {

    /**
     * 总用户数
     */
    var totalUsers: Int? = null

    /**
     * 总订阅者数
     */
    var totalSubscribers: Int? = null

    /**
     * 日同比变化，例子：-11%
     * 昨天/前天
     */
    var dodChange: String? = null

    /**
     * 周同比变化，例子：12%
     * 如：今天15日，14日/7日，若没有那么多天数据，则默认为100%
     */
    var wowChange: String? = null

}