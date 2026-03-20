package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.resp.AppUserInfoResp
import com.parsec.aika.user.remote.BotFeignClient
import com.parsec.aika.user.service.UserService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppUserController {

    @Resource
    private lateinit var userService: UserService

    @Resource
    private lateinit var botFeignClient: BotFeignClient

    /**
     * 用户详情
     */
    @GetMapping("/app/user/{id}")
    fun getAppUser(@PathVariable id: Long, loginUserInfo: LoginUserInfo): BaseResult<AppUserInfoResp> {
        return BaseResult.success(userService.getAppUser(id, loginUserInfo))
    }

    /**
     * 用户详情
     */
    @GetMapping("/app/user")
    fun getAppUserInfo(username: String, loginUserInfo: LoginUserInfo): BaseResult<AppUserInfoResp> {
        return BaseResult.success(userService.getAppUserInfo(username, loginUserInfo))
    }


    /**
     * 检查用户名是否可用
     * @param username 要检查的用户名
     * @param loginUserInfo 当前登录用户信息
     */
    @GetMapping("/app/user/check-username")
    fun checkUsernameAvailable(
        username: String,
        loginUserInfo: LoginUserInfo
    ): BaseResult<out Void?>? {
        // 验证用户名格式
        if (username.contains(" ")) {
            return BaseResult.failure("Username cannot contain spaces")
        }

        // 检查数据库中是否存在相同用户名（排除当前用户）
        if (userService.checkUserNameExist(username, loginUserInfo.userId)) {
            return BaseResult.failure("Username already exists")
        }

        // 检查bot名称是否冲突
        try {
            if (botFeignClient.checkBotNameExists(username).data) {
                return BaseResult.failure("Username already exists")
            }
        } catch (e: Exception) {
            // Feign调用失败时继续，不阻止用户名使用
            // 记录日志或进行其他处理
        }

        return BaseResult.success(null)
    }


}
