package com.parsec.aika.content.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.GetAppContentPostFeedReq
import com.parsec.aika.common.model.vo.resp.GetAppContentPostResp
import com.parsec.aika.common.model.vo.resp.GetAppContentPostThreadResp
import com.parsec.trantor.common.response.PageResult

interface PostContentService {
    fun getPostsFeed(req: GetAppContentPostFeedReq, loginUserInfo: LoginUserInfo): PageResult<GetAppContentPostResp>
    fun getPostsFollow(req: GetAppContentPostFeedReq, loginUserInfo: LoginUserInfo): PageResult<GetAppContentPostResp>
    fun getPostsPrivate(req: GetAppContentPostFeedReq, loginUserInfo: LoginUserInfo): PageResult<GetAppContentPostResp>
    fun getPostsThread(
        req: GetAppContentPostFeedReq,
        loginUserInfo: LoginUserInfo
    ): PageResult<GetAppContentPostThreadResp>
    
    fun getBlockedUserIds(userId: Long): List<Long>?
}
