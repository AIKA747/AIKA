package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.dto.PostDto
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.*
import com.parsec.aika.common.model.vo.resp.GetAppContentPostResp
import com.parsec.aika.common.model.vo.resp.GetAppContentPostThreadResp
import com.parsec.aika.common.model.vo.resp.GetAppShortcutResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.service.CommentService
import com.parsec.aika.content.service.PostContentService
import com.parsec.aika.content.service.PostService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

@RestController
class AppPostController {

    @Resource
    private lateinit var postContentService: PostContentService

    @Resource
    private lateinit var postService: PostService

    @Resource
    private lateinit var commentService: CommentService

    /**
     * 获取帖子流
     */
    @GetMapping("/app/posts/feed")
    fun getPostsFeeds(
        @Validated req: GetAppContentPostFeedReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<GetAppContentPostResp>> {
        return BaseResult.success(postContentService.getPostsFeed(req, loginUserInfo))
    }

    /**
     * 获取热门帖子
     */
    @GetMapping("/app/pop-posts")
    fun getPostsThread(
        @Validated req: GetAppContentPostFeedReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<GetAppContentPostThreadResp>> {
        return BaseResult.success(postContentService.getPostsThread(req, loginUserInfo))
    }

    /** 我关注的人发表的文章 */
    @GetMapping("/app/posts/follow")
    fun getPostsFollow(
        @Validated req: GetAppContentPostFeedReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<GetAppContentPostResp>> {
        return BaseResult.success(postContentService.getPostsFollow(req, loginUserInfo))
    }

    /** 指定用户发表的文章列表 */
    @GetMapping("/app/posts/private")
    fun getPostsPrivate(
        @Validated req: GetAppContentPostFeedReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<GetAppContentPostResp>> {
        return BaseResult.success(postContentService.getPostsPrivate(req, loginUserInfo))
    }

    @PostMapping("/app/posts")
    fun createPost(
        @RequestBody @Validated req: PostAppPostReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<Int> {
        val postId = postService.createPost(req, loginUserInfo)
        postService.moderations(postId)
        return BaseResult.success(postId)
    }

    @DeleteMapping("/app/posts/{id}")
    fun deletePost(@PathVariable id: Int, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        postService.deletePost(id, loginUserInfo)
        return BaseResult.success()
    }

    @PostMapping("/app/thumb")
    fun thumb(
        @RequestBody @Validated req: PostAppThumbReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<Void> {
        postService.thumb(req, loginUserInfo)
        postService.updatePostLikes(req.postId!!)

        return BaseResult.success()
    }

    /**
     * 帖子详情
     */
    @GetMapping("/app/post/{id}")
    fun detail(@PathVariable("id") id: Int, loginUserInfo: LoginUserInfo): BaseResult<PostDto> {
        return BaseResult.success(postService.detail(id, loginUserInfo))
    }

    /**
     * 获取用户收藏的帖子
     */
    @GetMapping("/app/shortcut")
    fun getShortcuts(loginUserInfo: LoginUserInfo): BaseResult<List<GetAppShortcutResp>> {
        return BaseResult.success(postService.getShortcuts(loginUserInfo))
    }

    @PutMapping("/app/post/visit")
    fun updateVisits(
        @RequestBody @Validated req: PostAppPostVisitReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<Void> {
        postService.updateVisits(req, loginUserInfo)
        return BaseResult.success()
    }

    @GetMapping("/app/post/{postId}/comment-users")
    fun getCommentUsers(
        @PathVariable postId: Int,
        req: GetCommentUsersReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<String>> {
        val post = postService.selectById(postId)
        val allUsernames = commentService.replyUsernames(post, req.username)
        val startIndex = (req.pageNo!! - 1) * req.pageSize!!
        val endIndex = minOf(startIndex + req.pageSize!!, allUsernames.size)
        val paginatedUsernames = if (startIndex < allUsernames.size) {
            allUsernames.subList(startIndex, endIndex)
        } else {
            emptyList()
        }
        val pageResult = PageUtil<String>().page(req, paginatedUsernames, allUsernames.size.toLong())
        return BaseResult.success(pageResult)
    }
}
