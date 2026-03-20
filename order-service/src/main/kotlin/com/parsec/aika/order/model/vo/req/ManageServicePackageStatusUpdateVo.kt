package com.parsec.aika.order.model.vo.req

import com.parsec.aika.common.model.em.ServicePackageStatusEnum
import javax.validation.constraints.NotNull

class ManageServicePackageStatusUpdateVo {

    /**
     * 服务包id
     */
    @NotNull
    var id: Long? = null

    /**
     * 状态：Active,Inactive
     */
    @NotNull
    var status: ServicePackageStatusEnum? = null

}