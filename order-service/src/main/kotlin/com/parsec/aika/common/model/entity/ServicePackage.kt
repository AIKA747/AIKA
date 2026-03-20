package com.parsec.aika.common.model.entity

import com.baomidou.mybatisplus.annotation.TableName
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.common.model.em.ServicePackageStatusEnum
import com.parsec.trantor.mybatisplus.base.BaseDomain

@TableName("service_package")
class ServicePackage : BaseDomain() {

    /**
     * 封面
     */
    var cover: String? = null

    /**
     * 详情
     */
    var description: String? = null

    /**
     * 限购次数；设置小于等于0时不限购
     */
    var purchaseLimit: Int? = null

    /**
     * 服务包名
     */
    var packageName: String? = null

    /**
     * 价格（单位分）
     */
    var price: Long? = null

    /**
     * 状态：Active，Inactive
     */
    var status: ServicePackageStatusEnum? = null


    var sortNo: Int? = null

    /**
     * 订阅时长，单位：天
     */
    var subPeriod: Int? = null

    /**
     * 是否可见：0否，1是
     */
    var visiblity: Boolean? = true

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