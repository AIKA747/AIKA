package com.parsec.aika.content.controller.manage

import com.parsec.aika.common.model.entity.PostReport
import com.parsec.aika.common.model.vo.req.ManagePostReportReq
import com.parsec.aika.common.model.vo.resp.PostReportResp
import com.parsec.aika.content.service.PostReportService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

@RestController
class ManagePostReportController {

    @Resource
    private lateinit var postReportService: PostReportService

    @GetMapping("/manage/report-list")
    fun reportList(): BaseResult<List<PostReport>> {
        return BaseResult.success(postReportService.reportList())
    }


    @GetMapping("/manage/post-reports")
    fun postReportList(req: ManagePostReportReq): BaseResult<PageResult<PostReportResp>> {
        return BaseResult.success(postReportService.postReportList(req))
    }

}