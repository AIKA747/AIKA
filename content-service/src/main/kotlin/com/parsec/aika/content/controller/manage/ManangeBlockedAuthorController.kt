package com.parsec.aika.content.controller.manage

import com.parsec.aika.common.model.vo.resp.BlockedAuthorResp
import com.parsec.aika.content.service.AuthorService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

/**
 * 封禁用户管理
 */
@RestController
class ManangeBlockedAuthorController {

    @Resource
    private lateinit var authorService: AuthorService

    @GetMapping("/manage/blocked-authors")
    fun blockedAuthors(pageNo: Int?, pagerSize: Int?, authorName: String?): BaseResult<PageResult<BlockedAuthorResp>> {
        return BaseResult.success(authorService.blockedAuthors(pageNo, pagerSize, authorName))
    }

    @PutMapping("/manage/author-unblocked")
    fun unblockedAuthor(userId: Long): BaseResult<*> {
        return BaseResult.success(authorService.unblockedAuthor(userId))
    }

}