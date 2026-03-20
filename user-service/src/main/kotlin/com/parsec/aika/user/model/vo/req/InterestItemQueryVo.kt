package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.user.model.em.InterestItemType

class InterestItemQueryVo : PageVo() {

    /**
     * 标签名称
     */
    var itemName: String? = null

    /**
     * 兴趣类型
     */
    var itemType: InterestItemType? = null

}
