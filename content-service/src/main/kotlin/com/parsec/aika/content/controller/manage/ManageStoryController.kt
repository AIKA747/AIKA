package com.parsec.aika.content.controller.manage

import com.parsec.aika.common.model.entity.Story
import com.parsec.aika.common.model.entity.StoryRecorder
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.model.vo.req.ManageStoryCreateVo
import com.parsec.aika.content.model.vo.req.ManageStoryUpdateVo
import com.parsec.aika.content.service.StoryService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

@RestController
class ManageStoryController {

    @Resource
    private lateinit var storyService: StoryService

    /**
     * 故事管理列表
     */
    @GetMapping("/manage/story")
    fun getStoryList(
        queryVo: com.parsec.aika.common.model.vo.req.ManageStoryQueryVo, user: LoginUserInfo
    ): BaseResult<PageResult<com.parsec.aika.common.model.vo.resp.ManageStoryListVo>> {
        return BaseResult.success(storyService.manageStoryList(queryVo))
    }

    /**
     * 创建故事
     */
    @PostMapping("/manage/story")
    fun createStory(@Validated @RequestBody vo: ManageStoryCreateVo, user: LoginUserInfo): BaseResult<String> {
        return BaseResult.success(storyService.manageStoryCreate(vo, user).toString())
    }

    /**
     * 修改故事
     */
    @PutMapping("/manage/story")
    fun updateStory(@Validated @RequestBody vo: ManageStoryUpdateVo, user: LoginUserInfo): BaseResult<Story> {
        return BaseResult.success(storyService.manageStoryUpdate(vo, user))
    }

    /**
     * 删除故事
     */
    @DeleteMapping("/manage/story/{id}")
    fun deleteStory(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        storyService.manageStoryDelete(id, user)
        return BaseResult.success()
    }

    /**
     * 设置故事发布状态
     */
    @PutMapping("/manage/story/status")
    fun updateStoryStatus(
        @Validated @RequestBody vo: com.parsec.aika.common.model.vo.req.ManageStoryUpdateStatusVo, user: LoginUserInfo
    ): BaseResult<Void> {
        storyService.manageStoryUpdateStatus(vo, user)
        return BaseResult.success()
    }

    /**
     * 故事详情
     */
    @GetMapping("/manage/story/{id}")
    fun getStoryDetail(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Story> {
        return BaseResult.success(storyService.manageStoryDetail(id))
    }


    @PostMapping("/manage/story/preview")
    fun storyPreview(
        @RequestBody req: com.parsec.aika.common.model.vo.req.StoryPreviewReq, user: LoginUserInfo
    ): BaseResult<StoryRecorder> {
        return BaseResult.success(storyService.storyPreview(req.storyId, req.chapterId, user.userId))
    }


    @GetMapping("/manage/export/story-count")
    fun storyUserCount(): ResponseEntity<ByteArray> {
        val bytes = storyService.storyUserCount()
        return ResponseEntity.ok().headers(HttpHeaders().apply {
            add("Content-Disposition", "attachment; filename=story_count_${System.currentTimeMillis()}.xls")
            contentType = MediaType.APPLICATION_OCTET_STREAM
        }).body(bytes)
    }

}
