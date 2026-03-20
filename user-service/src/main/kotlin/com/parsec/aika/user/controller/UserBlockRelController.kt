package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.ListBlockedUserReq
import com.parsec.aika.user.model.vo.resp.ListBlockedUserResp
import com.parsec.aika.user.service.UserBlockRelService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class UserBlockRelController {

    @Resource
    private lateinit var userBlockService: UserBlockRelService


    /**
     * 被屏蔽用户列表
     */
    @GetMapping("/app/user/blocked-user")
    fun listBlockedUser(
        req: ListBlockedUserReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<ListBlockedUserResp>> {
        req.userId = req.userId ?: loginUserInfo.userId
        return BaseResult.success(userBlockService.listBlockedUser(req))
    }

    /**
     * 屏蔽
     */
    @PutMapping("/app/user/block/{userId}")
    fun block(@PathVariable userId: Long, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        userBlockService.block(loginUserInfo.userId!!, userId)
        return BaseResult.success()
    }

    /**
     * 解除屏蔽
     */
    @PutMapping("/app/user/un-block/{userId}")
    fun unBlock(@PathVariable userId: Long, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        userBlockService.unBlock(loginUserInfo.userId!!, userId)
        return BaseResult.success()
    }

}