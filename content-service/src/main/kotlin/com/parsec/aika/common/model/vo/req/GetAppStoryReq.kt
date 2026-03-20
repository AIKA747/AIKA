package com.parsec.aika.content.model.vo.req

import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.vo.PageVo

/**
 * @author RainLin
 * @since 2024/1/26 11:31
 */
class GetAppStoryReq : PageVo() {

    // 故事名
    var storyName: String? = null

    var userId: Long? = null

    var status: GameStatus? = null

    var collected: Boolean? = null

    var categoryId: String? = null

    var statusList: List<String?>? = null
}
