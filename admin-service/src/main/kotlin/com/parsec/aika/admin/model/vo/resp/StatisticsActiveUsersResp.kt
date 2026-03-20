package com.parsec.aika.admin.model.vo.resp

class StatisticsActiveUsersResp {

    /**
     * 活跃用户数
     */
    var activeUsers: Int? = null

    /**
     * 平均每天用户数
     */
    var dailyActiveUsers: Double? = null

    /**
     * 日同比变化，例子：-11%
     * 昨天/前天
     */
    var dodChange: String? = null

    /**
     * 周同比变化，例子：12%
     * 如：今天15日，8-14日总数/1-7日总数，若没有那么多天数据，则默认为100%
     */
    var wowChange: String? = null

}