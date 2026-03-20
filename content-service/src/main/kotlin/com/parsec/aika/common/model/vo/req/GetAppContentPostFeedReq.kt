package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.em.AuthorType
import com.parsec.aika.common.model.vo.PageVo


class GetAppContentPostFeedReq : PageVo() {

    var topicTag: String? = null

    var keywords: String? = null

    var type: AuthorType? = null

    var userId: Long? = null
}
