package com.parsec.aika.order.model.vo.req

import com.parsec.aika.common.model.em.ServicePackageStatusEnum
import com.parsec.aika.common.model.vo.PageVo

class ManageServicePackageQueryVo: PageVo() {

    /**
     * 服务包名
     */
    var packageName: String? = null

    /**
     * 状态：Active，Inactive
     */
    var status: ServicePackageStatusEnum? = null

    /**
     * 是否可见：0否，1是
     */
    var visiblity: Boolean? = null

    /**
     * 时间段查询
     * 查询创建时间大于等于该时间的数据
     */
    var minCreatedAt: String? = null

    /**
     * 时间段查询
     * 查询创建时间小于等于该时间的数据
     */
    var maxCreatedAt: String? = null

}