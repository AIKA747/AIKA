package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer

/**
 * @author RainLin
 * @since 2024/1/26 11:31
 */
class GetAppGiftResp {
    // 礼物id
    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    // 礼物名
    var giftName: String? = null

    var image: String? = null
}
