package com.parsec.aika.user.model.vo.resp

import com.parsec.aika.user.model.em.InterestItemType

/**
 * @author husu
 * @version 1.0
 * @date 2024/11/3.
 */
class InterestItemCount {
    /**
     * 兴趣类型
     */
    var itemType: InterestItemType? = null


    /**
     * 数量
     */
    var count: Int? = null
}
