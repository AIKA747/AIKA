package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.resp.AppUserStatisticsResp
import com.parsec.aika.common.model.vo.resp.FollowUserResp
import com.parsec.aika.content.service.UserService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

@RestController
class AppUserController {

    @Resource
    private lateinit var userService: UserService

    /**
     * 获取用户统计数据
     */
    @GetMapping("/app/user/statistics")
    fun getUserStatistics(
        userId: Long?, loginUserInfo: LoginUserInfo
    ): BaseResult<AppUserStatisticsResp> {
        return BaseResult.success(userService.getUserStatistics(userId ?: loginUserInfo.userId!!))
    }

    @GetMapping("/app/follow-relation-users")
    fun followUsers(
        pageNo: Int?, pagerSize: Int?, type: Int?, userId: Long?, username: String?, loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<FollowUserResp>> {
        return BaseResult.success(userService.followUsers(pageNo, pagerSize, type, userId, username, loginUserInfo))
    }

}
