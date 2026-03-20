package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.AppFeedbackListReq
import com.parsec.aika.user.model.vo.req.UserFeedbackSaveReq
import com.parsec.aika.user.model.vo.resp.UserFeedbackDetailResp
import com.parsec.aika.user.model.vo.resp.UserFeedbackListResp
import com.parsec.aika.user.service.UserFeedbackService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
class AppUserFeedbackController {

    @Autowired
    private lateinit var userFeedbackService: UserFeedbackService

    @GetMapping("/app/feedback/list")
    fun list(req: AppFeedbackListReq, user: LoginUserInfo): BaseResult<PageResult<UserFeedbackListResp>> {
        return BaseResult.success(
            userFeedbackService.queryAppUserFeedbackList(
                req.pageNo, req.pageSize, user.userId, req.listType
            )
        )
    }

    @GetMapping("/app/feedback/{id}")
    fun detail(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<UserFeedbackDetailResp> {
        return BaseResult.success(userFeedbackService.userFeedbackInfo(id))
    }

    @PostMapping("/app/feedback")
    fun saveFeedback(
        @Validated @RequestBody req: UserFeedbackSaveReq,
        user: LoginUserInfo
    ): BaseResult<UserFeedbackDetailResp> {
        return BaseResult.success(userFeedbackService.saveFeedback(req, user))
    }

    @DeleteMapping("/app/feedback/{id}")
    fun withdrawFeedback(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<UserFeedbackDetailResp> {
        return BaseResult.success(userFeedbackService.withdrawFeedback(id, user))
    }


}