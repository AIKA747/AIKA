package com.parsec.aika.content.controller.manage

import cn.hutool.core.lang.Assert
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.service.StoryChapterService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

@RestController
class ManageChapterController {

    @Resource
    private lateinit var chapterService: StoryChapterService

    /**
     * 章节列表
     */
    @GetMapping("/manage/chapter")
    fun getChapterList(storyId: Long?, user: LoginUserInfo): BaseResult<List<com.parsec.aika.common.model.vo.resp.ManageChapterVo>> {
        return BaseResult.success(chapterService.manageStoryChapterList(storyId))
    }

    /**
     * 章节详情
     */
    @GetMapping("/manage/chapter/{id}")
    fun getChapterDetail(@PathVariable("id") id: Long): BaseResult<com.parsec.aika.common.model.vo.resp.ManageChapterVo> {
        return BaseResult.success(chapterService.manageStoryChapterDetail(id))
    }

    /**
     * 创建章节
     */
    @PostMapping("/manage/chapter")
    fun createChapter(@Validated @RequestBody chapter: com.parsec.aika.common.model.vo.req.ManageChapterCreateVo, user: LoginUserInfo): BaseResult<Long> {
        Assert.notEmpty(
            chapter.chapterRule,
            "The rules for story chapters cannot be empty, otherwise the progress of the story cannot be determined"
        )
        return BaseResult.success(chapterService.manageStoryChapterCreate(chapter, user))
    }

    /**
     * 修改章节
     */
    @PutMapping("/manage/chapter")
    fun updateChapter(
        @Validated @RequestBody chapter: com.parsec.aika.common.model.vo.req.ManageChapterUpdateVo,
        user: LoginUserInfo
    ): BaseResult<com.parsec.aika.common.model.vo.resp.ManageChapterVo> {
        Assert.notEmpty(
            chapter.chapterRule,
            "The rules for story chapters cannot be empty, otherwise the progress of the story cannot be determined"
        )
        return BaseResult.success(chapterService.manageStoryChapterUpdate(chapter, user))
    }

    /**
     * 修改章节顺序
     */
    @PutMapping("/manage/chapter/order")
    fun updateChapterOrder(
        @RequestBody chapterOrderList: List<com.parsec.aika.common.model.vo.req.ManageChapterUpdateOrderVo>,
        user: LoginUserInfo
    ): BaseResult<Void> {
        chapterService.manageStoryChapterUpdateOrderBatch(chapterOrderList, user)
        return BaseResult.success()
    }

    /**
     * 删除章节
     */
    @DeleteMapping("/manage/chapter/{id}")
    fun deleteChapter(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        chapterService.manageStoryChapterDelete(id, user)
        return BaseResult.success()
    }


}
