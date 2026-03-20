package com.parsec.aika.common.model.dto

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import java.time.LocalDateTime

class SubscriptionList {
    /**
     * 订单id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var orderId: Long? = null

    /**
     * app用户id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var userId: Long? = null

    /**
     * 消费者姓名
     */
    var username: String? = null

    /**
     * 邮箱
     */
    var email: String? = null

    /**
     * 电话
     */
    var phone: String? = null

    /**
     * 订阅过期时间
     * 对应order中的expiredAt
     */
    var expiredDate: LocalDateTime? = null

    /**
     * 订阅时间
     * 对应order中的callbackAt
     */
    var subscriptTime: LocalDateTime? = null

    var days: Int? = null

}