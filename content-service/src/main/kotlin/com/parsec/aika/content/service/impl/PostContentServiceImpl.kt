package com.parsec.aika.content.service.impl

import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.PostMapper
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.GetAppContentPostFeedReq
import com.parsec.aika.common.model.vo.resp.GetAppContentPostResp
import com.parsec.aika.common.model.vo.resp.GetAppContentPostThreadResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.remote.UserFeignClient
import com.parsec.aika.content.service.PostContentService
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

@Service
class PostContentServiceImpl : PostContentService {

    @Resource
    private lateinit var postMapper: PostMapper
    
    @Resource
    private lateinit var userFeignClient: UserFeignClient

    override fun getPostsFeed(
        req: GetAppContentPostFeedReq, loginUserInfo: LoginUserInfo
    ): PageResult<GetAppContentPostResp> {
        val page = Page<GetAppContentPostResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        val blockedUserIds = getBlockedUserIds(loginUserInfo.userId!!)
        return PageUtil<GetAppContentPostResp>().page(postMapper.getPostFeed(page, req, loginUserInfo.userId!!, blockedUserIds))
    }

    override fun getPostsThread(
        req: GetAppContentPostFeedReq, loginUserInfo: LoginUserInfo
    ): PageResult<GetAppContentPostThreadResp> {
        val page = Page<GetAppContentPostThreadResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        val blockedUserIds = getBlockedUserIds(loginUserInfo.userId!!)
        return PageUtil<GetAppContentPostThreadResp>().page(postMapper.listPostThread(page, req, loginUserInfo.userId!!, blockedUserIds))
    }

    override fun getPostsFollow(
        req: GetAppContentPostFeedReq, loginUserInfo: LoginUserInfo
    ): PageResult<GetAppContentPostResp> {
        val page = Page<GetAppContentPostResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        val blockedUserIds = getBlockedUserIds(loginUserInfo.userId!!)
        return PageUtil<GetAppContentPostResp>().page(postMapper.getPostsFollow(page, req, loginUserInfo.userId!!, blockedUserIds))
    }

    override fun getPostsPrivate(
        req: GetAppContentPostFeedReq, loginUserInfo: LoginUserInfo
    ): PageResult<GetAppContentPostResp> {
        val page = Page<GetAppContentPostResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        val result = if (null != req.userId) {
            val blockedUserIds = getBlockedUserIds(loginUserInfo.userId!!)
            // 如果该用户在被屏蔽用户列表中
            if (blockedUserIds != null && blockedUserIds.contains(req.userId)) {
                Page<GetAppContentPostResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong()).apply {
                    this.records = listOf()
                    this.total = 0
                }
            } else {
                postMapper.getPostsByUserId(page, req, loginUserInfo.userId!!)
            }
        } else {
            postMapper.getPostsPrivate(page, req, loginUserInfo.userId!!)
        }
        return PageUtil<GetAppContentPostResp>().page(result)
    }
    
    override fun getBlockedUserIds(userId: Long): List<Long>? {
        return userFeignClient.getBlockedUserIdList(userId)
    }
}
