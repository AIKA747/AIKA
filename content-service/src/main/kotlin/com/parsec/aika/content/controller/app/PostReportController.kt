package com.parsec.aika.content.controller.app

import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.entity.PostReport
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.PostReportReq
import com.parsec.aika.content.service.PostReportService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

@RestController
class PostReportController {

    @Resource
    private lateinit var postReportService: PostReportService

    @TranslateResult
    @GetMapping("/app/report-list", "/public/report-list")
    fun reportList(): BaseResult<List<PostReport>> {
        return BaseResult.success(postReportService.reportList())
    }

    @PostMapping("/app/post/report")
    fun reportPost(@Validated @RequestBody req: PostReportReq, user: LoginUserInfo): BaseResult<Void> {
        postReportService.reportPost(req.reportId!!, req.postId!!, user)
        return BaseResult.success()
    }

    @DeleteMapping("/app/post/report/{postId}")
    fun cancelPostReport(@PathVariable postId: Int, user: LoginUserInfo): BaseResult<Int> {
        return BaseResult.success(postReportService.cancelPostReport(postId, user))
    }

}