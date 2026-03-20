package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.model.vo.req.PostAppUserCollectStoryReq
import com.parsec.aika.common.model.vo.resp.GetAppUserCollectStoryResp
import com.parsec.aika.content.service.CollectStoryService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

/**
 * @author RainLin
 * @since 2024/1/26 11:20
 */
@RestController
class AppCollectStoryController {

    @Resource
    private lateinit var collectStoryService: CollectStoryService

    // 新增收藏
    @PostMapping("/app/user-collect-story")
    fun postAppUserCollectStory(
        @RequestBody @Validated req: PostAppUserCollectStoryReq,
        loginUserInfo: LoginUserInfo,
    ): BaseResult<Long?> {
        return BaseResult.success(collectStoryService.postAppUserCollectStory(req, loginUserInfo))
    }

    // 取消收藏
    @DeleteMapping("/app/user-collect-story/{storyId}")
    fun deleteAppUserCollectStoryId(@PathVariable storyId: Long, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        collectStoryService.deleteAppUserCollectStoryId(storyId, loginUserInfo)
        return BaseResult.success()
    }

    // 获得用户收藏的故事
    @GetMapping("/app/user-collect-story")
    fun getAppUserCollectStory(req: PageVo, loginUserInfo: LoginUserInfo): BaseResult<PageResult<GetAppUserCollectStoryResp>> {
        return BaseResult.success(collectStoryService.getAppUserCollectStory(req, loginUserInfo))
    }
}
