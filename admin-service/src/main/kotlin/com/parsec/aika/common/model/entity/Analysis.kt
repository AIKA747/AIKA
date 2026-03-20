package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import java.time.LocalDateTime

@TableName("`analysis`")
class Analysis {

    /**
     * id
     */
    var id: Long? = null

    /**
     * yyyyMMdd(凌晨统计前一天数据)
     */
    var dayId: String? = null

    /**
     * 国家
     */
    var country: String? = null

    /**
     * 当天新增订阅者数量
     */
    var newSubscribers: Int? = null

    /**
     * 当天过期的订阅者数量
     */
    var expiredSubscribers: Int? = null

    /**
     * 未过期订阅者总数量
     */
    var totalSubscribers: Int? = null

    /**
     * 即将过期订阅者数量
     */
    var upcomingExpiringSubscribers: Int? = null

    /**
     * 已过期用户总数量
     */
    var totalExpiredSubscribers: Int? = null

    /**
     * 总用户数
     */
    var totalUsers: Int? = null

    /**
     * 当天新增用户数
     */
    var newUsers: Int? = null

    /**
     * 当天活跃用户数
     */
    var activeUsers: Int? = null

    /**
     * 当天不活跃用户数
     */
    var inactiveUsers: Int? = null

    /**
     * 当天收入（单位分）
     */
    var income: Int? = null

    /**
     * 总收入（单位分）
     */
    var totalIncome: Int? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null
    
}