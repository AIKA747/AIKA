package com.parsec.aika.user.controller

import cn.hutool.core.lang.Assert
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.UserAppFollowerResp
import com.parsec.aika.user.model.vo.resp.UserAppFollowingResp
import com.parsec.aika.user.service.FollowerService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppUserFollowerController {

    @Resource
    lateinit var followerService: FollowerService

    /**
     * 关注我的用户列表
     */
    @GetMapping("/app/follower")
    fun appFollower(req: UserAppFollowerReq, userInfo: LoginUserInfo): BaseResult<PageResult<UserAppFollowerResp>> {
        return BaseResult.success(followerService.appFollower(req, userInfo))
    }

    /**
     * 我关注的用户列表
     */
    @GetMapping("/app/following")
    fun appFollowing(req: UserAppFollowingReq, userInfo: LoginUserInfo): BaseResult<PageResult<UserAppFollowingResp>> {
        return BaseResult.success(followerService.appFollowing(req, userInfo))
    }

    /**
     * 标记关注用户最新更新已读
     */
    @PutMapping("/app/follower/last-read-time")
    fun appFollowerLastReadTime(
        @RequestBody @Validated req: UserAppFollowerLastReadTimeReq,
        userInfo: LoginUserInfo
    ): BaseResult<Any> {
        return BaseResult.success(followerService.appFollowerLastReadTime(req, userInfo))
    }

    /**
     * 关注用户
     */
    @PostMapping("/app/following")
    fun appFollowing(@RequestBody @Validated req: AppFollowingReq, userInfo: LoginUserInfo): BaseResult<Any> {
        Assert.state(req.followingId == userInfo.userId, "Please do not focus on yourself")
        req.userId = userInfo.userId!!.toLong()
        return BaseResult.success(followerService.appFollowing(req))
    }

    @PostMapping("/app/follower")
    fun appFollowOrCancel(@RequestBody @Validated req: AppFollowOrCancelReq, userInfo: LoginUserInfo): BaseResult<Any> {
        req.userId = userInfo.userId!!.toLong()
        return BaseResult.success(followerService.appFollowOrCancel(req))
    }

    @GetMapping("/app/friends")
    fun appFollowFriends(@Validated req: AppFollowFriendsReq, userInfo: LoginUserInfo): BaseResult<Any> {
        req.userId = req.userId ?: userInfo.userId!!.toLong()
        return BaseResult.success(followerService.appFollowFriends(req))
    }
}
