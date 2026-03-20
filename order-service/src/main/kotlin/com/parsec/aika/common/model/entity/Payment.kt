package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import com.parsec.aika.common.model.em.PayTypeEnum
import com.parsec.trantor.mybatisplus.base.BaseDomain
import java.time.LocalDateTime

@TableName("payment")
class Payment : BaseDomain() {

    /**
     * 金额（单位分）
     */
    var amount: Long? = null

    /**
     * 支付回调时间
     */
    var callbackTime: LocalDateTime? = null

    /**
     * 信用卡号
     */
    var creditCard: String? = null

    /**
     * 订单号
     */
    var orderNo: String? = null

    /**
     * 支付方式
     */
    var payMethod: PayMethodEnum? = null

    /**
     * 第三方支付单号
     */
    var payNo: String? = null

    /**
     * 支付时间（由第三方支付平台返回）
     */
    var payTime: LocalDateTime? = null

    /**
     * 失败的消息
     */
    var reason: String? = null

    /**
     * 退款单号，该字段不为空时表明是退款
     */
    var refundNo: String? = null

    /**
     * default，success，fail
     */
    var status: PayStatusEnum? = null

    /**
     * Payment,Refund  支付还是退款
     */
    var type: PayTypeEnum? = null

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

    var transactionId: String? = null

    var receipt: String? = null

}