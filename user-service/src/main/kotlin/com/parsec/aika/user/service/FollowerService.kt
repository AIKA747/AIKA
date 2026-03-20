package com.parsec.aika.user.service

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.entity.AppFriendInfo
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.UserAppFollowerResp
import com.parsec.aika.user.model.vo.resp.UserAppFollowingResp
import com.parsec.trantor.common.response.PageResult

interface FollowerService {
    fun appFollower(req: UserAppFollowerReq, userInfo: LoginUserInfo): PageResult<UserAppFollowerResp>

    fun appFollowing(req: UserAppFollowingReq, userInfo: LoginUserInfo): PageResult<UserAppFollowingResp>

    fun appFollowerLastReadTime(req: UserAppFollowerLastReadTimeReq, userInfo: LoginUserInfo)

    /**
     * 关注用户
     */
    fun appFollowing(req: AppFollowingReq)

    fun appFollowOrCancel(req: AppFollowOrCancelReq)

    fun appFollowFriends(req: AppFollowFriendsReq): PageResult<AppFriendInfo>

    fun getFollowingIdList(id: Long): List<String>
}
