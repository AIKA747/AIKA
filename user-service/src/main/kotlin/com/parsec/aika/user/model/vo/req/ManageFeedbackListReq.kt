package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.user.model.entity.FeedbackStatus

class ManageFeedbackListReq : PageVo() {

    var titleValue: String? = null

    var title: String? = null

    var category: String? = null

    var username: String? = null

    var minSubmissionAt: String? = null

    var maxSubmissionAt: String? = null

    var device: String? = null

    var systemVersion: String? = null

    var iuessId: String? = null

    var status: FeedbackStatus? = null

}