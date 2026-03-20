package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.InterestTags
import com.parsec.aika.user.model.vo.req.ManageTagsCreateVo
import com.parsec.aika.user.model.vo.req.ManageTagsQueryVo
import com.parsec.aika.user.model.vo.req.ManageTagsUpdateSortNoVo
import com.parsec.aika.user.model.vo.req.ManageTagsUpdateVo
import com.parsec.aika.user.model.vo.resp.ManageTagsListVo
import com.parsec.aika.user.service.InterestTagsService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageTagsController {

    @Resource
    private lateinit var interestTagsService: InterestTagsService

    /**
     * 标签管理列表
     */
    @GetMapping("/manage/tags")
    fun getTagList(queryVo: ManageTagsQueryVo, user: LoginUserInfo): BaseResult<PageResult<ManageTagsListVo>> {
        return BaseResult.success(interestTagsService.manageTagsList(queryVo))
    }

    /**
     * 新增标签
     */
    @PostMapping("/manage/tag")
    fun createTag(@Validated @RequestBody vo: ManageTagsCreateVo, user: LoginUserInfo): BaseResult<String> {
        return BaseResult.success(interestTagsService.manageTagCreate(vo, user).toString())
    }

    /**
     * 修改标签
     */
    @PutMapping("/manage/tag")
    fun updateTag(@Validated @RequestBody vo: ManageTagsUpdateVo, user: LoginUserInfo): BaseResult<InterestTags> {
        return BaseResult.success(interestTagsService.manageTagUpdate(vo, user))
    }

    /**
     * 修改标签排序
     */
    @PatchMapping("/manage/tag")
    fun updateSortNoTag(@Validated @RequestBody vo: ManageTagsUpdateSortNoVo, user: LoginUserInfo): BaseResult<Void> {
        interestTagsService.manageTagUpdateSortNo(vo, user)
        return BaseResult.success()
    }

    /**
     * 删除标签
     */
    @DeleteMapping("/manage/tag/{id}")
    fun deleteTag(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        interestTagsService.manageTagDelete(id, user)
        return BaseResult.success()
    }

}