package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.vo.PageVo

class ManagePostReportReq : PageVo() {

    var postId: Int? = null
    var reportId: Int? = null

    var postAuthorName: String? = null

    var authorName: String? = null

    var minTime: String? = null

    var maxTime: String? = null

}