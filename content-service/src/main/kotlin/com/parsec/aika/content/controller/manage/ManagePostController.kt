package com.parsec.aika.content.controller.manage

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONObject
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.vo.resp.ManagePostListResp
import com.parsec.aika.content.service.PostConfigService
import com.parsec.aika.content.service.PostService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

@RestController
class ManagePostController {

    @Resource
    private lateinit var postService: PostService

    @Resource
    private lateinit var postConfigService: PostConfigService

    @GetMapping("/manage/post-list")
    fun getPostPage(
        pageNo: Int?,
        pagerSize: Int?,
        searchWord: String?,
        flagged: Boolean?
    ): BaseResult<PageResult<ManagePostListResp>> {
        return BaseResult.success(postService.getPostPage(pageNo ?: 1, pagerSize ?: 10, searchWord, flagged))
    }

    @GetMapping("/manage/post-detail")
    fun getPostDetail(id: Int): BaseResult<Post> {
        return BaseResult.success(postService.selectById(id))
    }

    @PutMapping("/manage/post-blocked")
    fun postBlocked(ids: String, blocked: Boolean): BaseResult<Int> {
        Assert.notBlank(ids, "ids can not empty")
        val idArr = ids.split(",").map { it.toInt() }
        return BaseResult.success(postService.postBlocked(idArr, blocked))
    }

    @DeleteMapping("/manage/post")
    fun deletePost(ids: String): BaseResult<Int> {
        Assert.notBlank(ids, "ids can not empty")
        val idArr = ids.split(",").map { it.toInt() }
        return BaseResult.success(postService.deletePosts(idArr))
    }

    @GetMapping("/manage/post-create-config")
    fun getPostCreateConfig(): BaseResult<*> {
        return BaseResult.success(JSONObject().apply {
            set("postCreateBlockedEnabled", postConfigService.postCreateBlockedEnabled())
            set("postCreateBlockedNumber", postConfigService.postCreateBlockedNumber())
        })
    }

    @PutMapping("/manage/post-create-config")
    fun putPostCreateConfig(postCreateBlockedEnabled: Boolean, postCreateBlockedNumber: Int): BaseResult<*> {
        Assert.notNull(postCreateBlockedEnabled, "postCreateBlockedEnabled can not null")
        Assert.state(postCreateBlockedNumber > 0, "postCreateBlockedNumber must be greater than 0")
        postConfigService.setPostCreateBlockedEnabled(postCreateBlockedEnabled)
        postConfigService.setPostCreateBlockedNumber(postCreateBlockedNumber)
        return BaseResult.success()
    }

}