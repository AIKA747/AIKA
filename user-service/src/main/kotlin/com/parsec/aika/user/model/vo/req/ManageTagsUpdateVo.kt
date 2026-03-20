package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotNull

class ManageTagsUpdateVo {

    /**
     * 标签id
     */
    @NotNull(message = "标签id不能为空")
    var id: Long? = null

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