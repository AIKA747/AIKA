package com.parsec.aika.content.controller.app

import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.PostAppStoryRecorderReq
import com.parsec.aika.common.model.vo.resp.GetAppStoryIdChapterResp
import com.parsec.aika.common.model.vo.resp.GetAppStoryIdResp
import com.parsec.aika.common.model.vo.resp.PostAppStoryRecorderResp
import com.parsec.aika.content.model.vo.req.GetAppStoryReq
import com.parsec.aika.common.model.vo.resp.GetAppStoryResp
import com.parsec.aika.content.service.StoryService
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
class AppStoryController {

    @Resource
    private lateinit var storyService: StoryService

    // 故事列表
    @TranslateResult
    @GetMapping("/app/story")
    fun getAppStory(req: GetAppStoryReq, loginUserInfo: LoginUserInfo): BaseResult<PageResult<GetAppStoryResp>> {
        return BaseResult.success(storyService.getAppStory(req, loginUserInfo))
    }

    // 故事详情
    @GetMapping("/app/story/{id}")
    fun getAppStoryId(@PathVariable id: Long, loginUserInfo: LoginUserInfo): BaseResult<GetAppStoryIdResp> {
        return BaseResult.success(storyService.getAppStoryId(id, loginUserInfo))
    }

    // 查看过关/失败的信息
    @GetMapping("/app/story/{id}/chapter")
    fun getAppStoryIdChapter(@PathVariable id: Long, loginUserInfo: LoginUserInfo): BaseResult<GetAppStoryIdChapterResp> {
        return BaseResult.success(storyService.getAppStoryIdChapter(id, loginUserInfo))
    }

    // 开始一个新的游戏
    @PostMapping("/app/story-recorder")
    fun postAppStoryRecorder(@RequestBody @Validated req: PostAppStoryRecorderReq, loginUserInfo: LoginUserInfo): BaseResult<PostAppStoryRecorderResp> {
        return BaseResult.success(storyService.postAppStoryRecorder(req, loginUserInfo))
    }
}
