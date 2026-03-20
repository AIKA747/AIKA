package com.parsec.aika.user.model.vo.req

import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.user.model.em.JobCategory
import com.parsec.aika.user.model.entity.JobStatus

class ManagePushJobListReq : PageVo() {

    var name: String? = null

    var category: JobCategory? = null

    var status: JobStatus? = null

    var excuted: Boolean? = null

    var sysJob: Boolean? = false

    var minCreatedAt: String? = null

    var maxCreatedAt: String? = null

}