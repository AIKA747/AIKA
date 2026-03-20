package com.parsec.aika.user.service

import cn.hutool.json.JSONObject
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.UserFeedbackDetailResp
import com.parsec.aika.user.model.vo.resp.UserFeedbackListResp
import com.parsec.aika.user.model.vo.resp.UserFeedbackManageListResp
import com.parsec.trantor.common.response.PageResult

interface UserFeedbackService {
    fun queryAppUserFeedbackList(
        pageNo: Int?, pageSize: Int?, userId: Long?, listType: String?
    ): PageResult<UserFeedbackListResp>

    fun userFeedbackInfo(id: Long?): UserFeedbackDetailResp?
    fun saveFeedback(req: UserFeedbackSaveReq, user: LoginUserInfo): UserFeedbackDetailResp?
    fun queryManageUserFeedbackList(req: ManageFeedbackListReq): PageResult<UserFeedbackManageListResp>?
    fun replyFeedback(req: ManageFeedbackReplyReq, user: LoginUserInfo): UserFeedbackDetailResp?
    fun withdrawFeedback(id: Long, user: LoginUserInfo): UserFeedbackDetailResp?
    fun updateFeedbackStatus(req: FeedbackStatusReq, user: LoginUserInfo): UserFeedbackDetailResp?
    fun reportQuantity(req: FeedbackStatisticsReq, user: LoginUserInfo): List<JSONObject>?
    fun titleStatistics(req: FeedbackStatisticsReq, user: LoginUserInfo): List<JSONObject>?
    fun statusStatistics(req: FeedbackStatisticsReq, user: LoginUserInfo): List<JSONObject>?
}