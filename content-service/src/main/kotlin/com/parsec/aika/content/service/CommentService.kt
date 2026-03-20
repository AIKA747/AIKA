package com.parsec.aika.content.service

import com.parsec.aika.common.model.entity.Comment
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.CommentCreateVo
import com.parsec.aika.common.model.vo.req.CommentQueryVo
import com.parsec.aika.common.model.vo.resp.CommentResp
import com.parsec.trantor.common.response.PageResult

interface CommentService {
    /**
     * 分页查询文章评论列表
     */
    fun pageList(req: CommentQueryVo): PageResult<CommentResp>

    /**
     * 新增文章评论
     */
    fun create(vo: CommentCreateVo, user: LoginUserInfo): Comment

    /**
     * 删除文章评论
     */
    fun delete(id: Int, user: LoginUserInfo, callback: (postId: Int) -> Unit)

    /**
     * 更新文章评论数
     */
    fun updatePostCommentCount(postId: Int)

    /**
     * 获取帖子的回帖人(username)列表
     * @param post 贴子
     * @param username 不为空则实现按前缀匹配，为空则返回所有
     */
    fun replyUsernames(post: Post, username: String?): List<String>

    /**
     *查詢用戶的回帖列表
     */
    fun userPageList(pageNo: Int, pageSize: Int, userId: Long?, loginUserId: Long): PageResult<CommentResp>?

    /**
     *
     * 编辑评论
     */
    fun editComment(vo: CommentCreateVo, user: LoginUserInfo): Int?
}


