package com.parsec.aika.order.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

class OrderEndpointQueryVo: PageVo() {

    /**
     * 用户昵称/姓名
     */
    var username: String? = null

    /**
     * 订阅状态：varid，Expired
     * 根据订单表中的订阅过期时间判断
     */
    var subStatus: String? = null

    var email: String? = null

    var phone: String? = null

    /**
     * 用户分组id
     */
    var groupId: Long? = null

    var userIds: List<Long>? = null

    /**
     * 剩余时间，单位：天（(90/30/7)）
     * 查询还有7天过期，还有30天过期，还有90天过期
     * 判断过期时间(expiredAt)
     * 暂定：过期时间 - 当前时间 <= 传入的天数
     */
    var remainingDays: Int? = null

    /**
     *
     * 时间段对应查询字段：订阅时间(callbackAt)
     */
    var maxSubscriptionTime: String? = null
    var minSubscriptionTime: String? = null

}