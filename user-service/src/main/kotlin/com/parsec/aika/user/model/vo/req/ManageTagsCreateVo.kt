package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotNull

class ManageTagsCreateVo {

    /**
     * 标签名称
     */
    @NotNull(message = "标签名称不能为空")
    var tagName: String? = null

    /**
     * 标签排序，升序排列
     */
    var sortNo: Int? = null

}