package com.parsec.aika.order.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.aspect.Translate
import java.time.LocalDateTime

@Translate(fields = ["packageName"])
class AppServicePackageVo {

    /**
     * 服务包id
     */
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    /**
     * 服务包名
     */
    var packageName: String? = null

    /**
     * 封面
     */
    var cover: String? = null

    /**
     * 详情
     */
    var description: String? = null

    /**
     * 价格（单位分）
     */
    var price: Double? = null

    /**
     * 订阅时长，单位：天
     */
    var subPeriod: Long? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null


    var purchaseLimit: Int? = null

    var purchaseNum: Int? = null

}