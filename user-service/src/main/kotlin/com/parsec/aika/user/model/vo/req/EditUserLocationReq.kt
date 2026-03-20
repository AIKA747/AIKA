package com.parsec.aika.user.model.vo.req

import org.jetbrains.annotations.NotNull

/**
 * 编辑用户经纬度
 */
class EditUserLocationReq {


    @NotNull
    var curLat: Double? = null

    @NotNull
    var curLng: Double? = null


}
