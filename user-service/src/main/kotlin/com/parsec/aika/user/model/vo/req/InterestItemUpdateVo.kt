package com.parsec.aika.user.model.vo.req

import com.alibaba.fastjson.JSONArray
import com.parsec.aika.user.model.em.InterestItemType
import jakarta.validation.constraints.NotNull

class InterestItemUpdateVo {

    /**
     * 兴趣id
     */
    @NotNull(message = "兴趣id不能为空")
    var id: Int? = null

    /**
     * 兴趣名称
     */
    @NotNull(message = "兴趣名称不能为空")
    var itemName: String? = null

    /**
     * 兴趣类型
     */
    @NotNull(message = "兴趣类型不能为空")
    var itemType: InterestItemType? = null

    /**
     *  备注
     */
    var remark: String? = null

    /**
     * 用来保证向量的准确性，默认填id号，在任何时候取升序排列
     */
    var orderNum: Int? = null

    /**
     * 是否支持多个选项
     */
    @NotNull(message = "multiple不能为空")
    var multiple: Boolean? = null

    /**
     * 向量值，如果兴趣是单一选项，则为空
     */
    var valueArray: JSONArray? = null

}
