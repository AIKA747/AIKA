package com.parsec.aika.content.service

import com.parsec.aika.common.model.dto.PostDto
import com.parsec.aika.common.model.entity.Post
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.BotPostReq
import com.parsec.aika.common.model.vo.req.PostAppPostReq
import com.parsec.aika.common.model.vo.req.PostAppPostVisitReq
import com.parsec.aika.common.model.vo.req.PostAppThumbReq
import com.parsec.aika.common.model.vo.resp.GetAppShortcutResp
import com.parsec.aika.common.model.vo.resp.ManagePostListResp
import com.parsec.trantor.common.response.PageResult

interface PostService {
    fun createPost(req: PostAppPostReq, loginUserInfo: LoginUserInfo): Int
    fun deletePost(id: Int, loginUserInfo: LoginUserInfo)
    fun thumb(req: PostAppThumbReq, loginUserInfo: LoginUserInfo)
    fun detail(id: Int, loginUserInfo: LoginUserInfo): PostDto
    fun updatePostLikes(postId: Int)
    fun getShortcuts(loginUserInfo: LoginUserInfo): List<GetAppShortcutResp>
    fun updateVisits(req: PostAppPostVisitReq, loginUserInfo: LoginUserInfo)
    fun selectById(id: Int): Post
    fun createBotPost(req: BotPostReq): Int
    fun getPostPage(pageNo: Int, pageSize: Int, searchWord: String?, flagged: Boolean?): PageResult<ManagePostListResp>?
    fun postBlocked(ids: List<Int>, blocked: Boolean): Int
    fun deletePosts(ids: List<Int>): Int?

    fun moderations(postId: Int)
}
