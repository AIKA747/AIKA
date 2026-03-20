package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("`order`")
class Order : BaseDomain() {

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
     * 用户分组id
     */
    var groupId: Long? = null

    /**
     * 订单号
     */
    var orderNo: String? = null

    /**
     * 消费金额（单位分）
     */
    var amount: Long? = null

    /**
     * 支付回调时间
     */
    var callbackAt: LocalDateTime? = null

    /**
     * 取消时间
     */
    var cancelAt: LocalDateTime? = null

    /**
     * 国家
     */
    var country: String? = null

    /**
     * 邮箱
     */
    var email: String? = null

    /**
     * 订阅过期时间
     */
    var expiredAt: LocalDateTime? = null

    /**
     * 服务包id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var packageId: Long? = null

    /**
     * 服务包名称
     */
    var packageName: String? = null

    /**
     * 电话
     */
    var phone: String? = null

    /**
     * 订单状态：Cancelled，Unpaid，Success
     */
    var status: OrderStatusEnum? = null

    /**
     * 创建人id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var creator: Long? = null

    /**
     * 创建人名称
     */
    var creatorName: String? = null

    /**
     * 更新人
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var updater: Long? = null

}