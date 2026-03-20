package com.parsec.aika.user.model.vo.req

import jakarta.validation.constraints.NotNull

class ManageTagsUpdateSortNoVo {

    /**
     * 标签id
     */
    @NotNull(message = "标签id不能为空")
    var id: Long? = null

    /**
     * 标签排序，升序排列
     */
    var sortNo: Int? = null

}