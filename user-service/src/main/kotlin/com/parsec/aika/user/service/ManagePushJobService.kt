package com.parsec.aika.user.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.PushJob
import com.parsec.aika.user.model.vo.req.ManageJobEditReq
import com.parsec.aika.user.model.vo.req.ManagePushJobListReq
import com.parsec.aika.user.model.vo.resp.ManagePushJobListResp
import com.parsec.trantor.common.response.PageResult
import java.time.LocalDateTime

interface ManagePushJobService {
    fun pushJobList(req: ManagePushJobListReq): PageResult<ManagePushJobListResp>?
    fun jobDetail(id: Long?): PushJob?
    fun editPushJob(req: ManageJobEditReq, user: LoginUserInfo): PushJob?
    fun updateJobStatus(id: Long, status: Boolean): PushJob?

    fun deletePushJob(id: Long)
    fun cronConverter(dateTime: LocalDateTime): String
}
