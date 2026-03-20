package com.parsec.aika.common.model.vo.resp

import com.fasterxml.jackson.annotation.JsonIgnore

class ApiEstimatedWeightResp {
    /**
     * 重量，单位(克)：g
     */
    var weight: Long? = null

    /**
     * 描述
     */
    @JsonIgnore
    var description: String? = null


}
