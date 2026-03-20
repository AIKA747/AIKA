package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.GetPushListsReq
import com.parsec.aika.user.model.vo.req.PostPushListReq
import com.parsec.aika.user.model.vo.resp.GetPushListIdResp
import com.parsec.aika.user.model.vo.resp.GetPushListsResp
import com.parsec.aika.user.service.PushListService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManagePushListController {

    @Resource
    private lateinit var pushListService: PushListService

    /**
     * 分页查询
     */
    @GetMapping("/manage/push-lists")
    fun getPushLists(req: GetPushListsReq, loginUserInfo: LoginUserInfo): BaseResult<PageResult<GetPushListsResp>> {
        return BaseResult.success(pushListService.getPushLists(req))
    }

    /**
     * 详情
     */
    @GetMapping("/manage/push-list/{id}")
    fun getPushListId(@PathVariable id: Long, loginUserInfo: LoginUserInfo): BaseResult<GetPushListIdResp> {
        return BaseResult.success(pushListService.getPushListId(id))
    }

    /**
     * 新增推送记录
     */
    @PostMapping("/manage/push-list")
    fun postPushList(@RequestBody @Validated req: PostPushListReq, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        pushListService.postPushList(req, loginUserInfo)
        return BaseResult.success()
    }

}