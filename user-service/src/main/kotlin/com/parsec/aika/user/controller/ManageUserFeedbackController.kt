package com.parsec.aika.user.controller

import cn.hutool.json.JSONObject
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.FeedbackStatisticsReq
import com.parsec.aika.user.model.vo.req.FeedbackStatusReq
import com.parsec.aika.user.model.vo.req.ManageFeedbackListReq
import com.parsec.aika.user.model.vo.req.ManageFeedbackReplyReq
import com.parsec.aika.user.model.vo.resp.UserFeedbackDetailResp
import com.parsec.aika.user.model.vo.resp.UserFeedbackManageListResp
import com.parsec.aika.user.service.UserFeedbackService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
class ManageUserFeedbackController {


    @Autowired
    private lateinit var userFeedbackService: UserFeedbackService

    @GetMapping("/manage/feedback/list")
    fun list(req: ManageFeedbackListReq): BaseResult<PageResult<UserFeedbackManageListResp>> {
        return BaseResult.success(userFeedbackService.queryManageUserFeedbackList(req))
    }

    @GetMapping("/manage/feedback/{id}")
    fun detail(@PathVariable("id") id: Long): BaseResult<UserFeedbackDetailResp> {
        return BaseResult.success(userFeedbackService.userFeedbackInfo(id))
    }

    @PostMapping("/manage/feedback/reply")
    fun replyFeedback(
        @RequestBody @Validated req: ManageFeedbackReplyReq, user: LoginUserInfo
    ): BaseResult<UserFeedbackDetailResp> {
        return BaseResult.success(userFeedbackService.replyFeedback(req, user))
    }

    @PatchMapping("/manage/feedback")
    fun updateFeedbackStatus(
        @RequestBody @Validated req: FeedbackStatusReq, user: LoginUserInfo
    ): BaseResult<UserFeedbackDetailResp> {
        return BaseResult.success(userFeedbackService.updateFeedbackStatus(req, user))
    }

    @GetMapping("/manage/feedback/report-quantity")
    fun reportQuantity(@Validated req: FeedbackStatisticsReq, user: LoginUserInfo): BaseResult<List<JSONObject>> {
        return BaseResult.success(userFeedbackService.reportQuantity(req, user))
    }

    @GetMapping("/manage/feedback/title-statistics")
    fun titleStatistics(req: FeedbackStatisticsReq, user: LoginUserInfo): BaseResult<List<JSONObject>> {
        return BaseResult.success(userFeedbackService.titleStatistics(req, user))
    }

    @GetMapping("/manage/feedback/status-statistics")
    fun statusStatistics(req: FeedbackStatisticsReq, user: LoginUserInfo): BaseResult<List<JSONObject>> {
        return BaseResult.success(userFeedbackService.statusStatistics(req, user))
    }

}