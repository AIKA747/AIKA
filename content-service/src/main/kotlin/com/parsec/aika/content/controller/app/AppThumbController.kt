package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.resp.AppThumbListResp
import com.parsec.aika.content.service.ThumbService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

@RestController
class AppThumbController {

    @Resource
    private lateinit var thumbService: ThumbService

    @GetMapping("/app/post-thumb-user-list")
    fun getPostThumbList(
        pageNo: Int?,
        pageSize: Int?,
        postId: Int,
        user: LoginUserInfo
    ): BaseResult<PageResult<AppThumbListResp>> {
        return BaseResult.success(thumbService.getPostThumbList(pageNo, pageSize, postId, user))
    }


}