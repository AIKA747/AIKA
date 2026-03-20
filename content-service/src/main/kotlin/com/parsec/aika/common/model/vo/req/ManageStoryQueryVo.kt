package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.em.StoryStatus
import com.parsec.aika.common.model.vo.PageVo

class ManageStoryQueryVo : PageVo() {

    var storyName: String? = null
    var status: StoryStatus? = null
    var minCreatedAt: String? = null
    var maxCreatedAt: String? = null
}
