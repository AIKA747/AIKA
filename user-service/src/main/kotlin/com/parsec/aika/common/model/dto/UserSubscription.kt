package com.parsec.aika.common.model.dto

import java.time.LocalDateTime

data class UserSubscription(
    /**
     * 封面
     */
    val cover: String?,

    /**
     * 明细
     */
    val description: String?,

    /**
     * 过期时间
     */
    val expiredDate: LocalDateTime?,

    /**
     * 服务包id
     */
    val packageId: Long?,

    /**
     * 订阅计划
     */
    val packageName: String?,

    /**
     * 订阅时间
     */
    val subscriptTime: LocalDateTime?
)