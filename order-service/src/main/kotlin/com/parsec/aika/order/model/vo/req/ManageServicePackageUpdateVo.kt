package com.parsec.aika.order.model.vo.req

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

class ManageServicePackageUpdateVo {

    /**
     * 服务包id
     */
    @NotNull
    var id: Long? = null

    /**
     * 封面
     */
    var cover: String? = null

    /**
     * 详情
     */
    var description: String? = null

    /**
     * 服务包名
     */
    @NotBlank
    var packageName: String? = null

    /**
     * 价格（单位分）
     */
    var price: Long? = null

    /**
     * 订阅时长，单位：天
     */
    var subPeriod: Int? = null

    /**
     * 是否可见：0否，1是
     */
    var visiblity: Boolean? = true

    var purchaseLimit: Int? = null

    var sortNo: Int? = null

}