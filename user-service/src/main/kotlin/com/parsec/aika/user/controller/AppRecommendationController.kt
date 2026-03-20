package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.AppUserVO
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.service.UserService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

/**
 * @author husu
 * @version 1.0
 * @date 2025/5/7.
 */
@RestController
class AppRecommendationController {

    @Resource
    private lateinit var userService: UserService

    @GetMapping("/app/recommendation")
    fun recommendationUserList(user: LoginUserInfo): BaseResult<List<AppUserVO>> {
        return BaseResult.success(userService.getRecommendUserList(user.userId!!))
    }

    @GetMapping("/app/v2/recommendation")
    fun recommendUserList(user: LoginUserInfo): BaseResult<List<AppUserVO>> {
        return BaseResult.success(userService.getRecommendUserListV2(user.userId!!))
    }
}
