package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.entity.Comment
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.CommentCreateVo
import com.parsec.aika.common.model.vo.req.CommentQueryVo
import com.parsec.aika.common.model.vo.resp.CommentResp
import com.parsec.aika.content.service.CommentService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

@RestController
class AppCommentController {

    @Resource
    private lateinit var commentService: CommentService

    /**
     * 评论列表
     */
    @GetMapping("/app/comment")
    fun getPageList(@Validated queryVo: CommentQueryVo, user: LoginUserInfo): BaseResult<PageResult<CommentResp>> {
        queryVo.loginUserId = user.userId
        return BaseResult.success(commentService.pageList(queryVo))
    }

    /**
     * 新增评论
     */
    @PostMapping("/app/comment")
    fun createComment(@Validated @RequestBody vo: CommentCreateVo, user: LoginUserInfo): BaseResult<Comment> {
        val comment = commentService.create(vo, user)
        commentService.updatePostCommentCount(vo.postId!!)
        return BaseResult.success(comment)
    }

    @PutMapping("/app/comment")
    fun editComment(@Validated @RequestBody vo: CommentCreateVo, user: LoginUserInfo): BaseResult<Int> {
        val commentId = commentService.editComment(vo, user)
        return BaseResult.success(commentId)
    }

    /**
     * 删除评论
     */
    @DeleteMapping("/app/comment/{id}")
    fun deleteComment(@PathVariable("id") id: Int, user: LoginUserInfo): BaseResult<Void> {
        commentService.delete(id, user) {
            commentService.updatePostCommentCount(it)
        }

        return BaseResult.success()
    }

    /**
     * 评论列表
     */
    @GetMapping("/app/user-comment")
    fun getuserCommentPageList(
        pageNo: Int?,
        pageSize: Int?,
        @RequestParam(required = true) userId: Long? = null,
        user: LoginUserInfo
    ): BaseResult<PageResult<CommentResp>> {
        return BaseResult.success(commentService.userPageList(pageNo ?: 1, pageSize ?: 10, userId, user.userId!!))
    }

}
