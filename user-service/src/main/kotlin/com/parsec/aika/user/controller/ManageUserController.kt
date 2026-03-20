package com.parsec.aika.user.controller

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.vo.req.ManageUserListReq
import com.parsec.aika.user.model.vo.req.ManageUserStatusReq
import com.parsec.aika.user.model.vo.req.UpdatePasswordReq
import com.parsec.aika.user.model.vo.resp.ManagerUserListResp
import com.parsec.aika.user.model.vo.resp.ManagerUserResp
import com.parsec.aika.user.service.UserService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageUserController {

    @Resource
    private lateinit var userService: UserService

    /**
     * 删除用户
     */
    @DeleteMapping("/manage/user/{id}")
    fun manageUser(@PathVariable id: Long): BaseResult<Any> {
        return BaseResult.success(userService.deleteById(id))
    }

    /**
     * 改变用户状态
     */
    @PutMapping("/manage/user/status")
    fun manageUserStatus(@RequestBody @Validated req: ManageUserStatusReq): BaseResult<Any> {
        return BaseResult.success(userService.manageUserStatus(req))
    }


    /**
     * 用户详情
     */
    @GetMapping("/manage/user/{id}")
    fun getManageUser(@PathVariable id: Long): BaseResult<ManagerUserResp> {
        return BaseResult.success(userService.getManageUser(id))
    }

    /**
     * 用户列表
     */
    @GetMapping("/manage/user")
    fun manageUserList(req: ManageUserListReq): BaseResult<PageResult<ManagerUserListResp>> {
        return BaseResult.success(userService.manageUserList(req))
    }

    /**
     * 修改密码
     */
    @PatchMapping("/app/pwd")
    fun updatePassword(@Validated @RequestBody req: UpdatePasswordReq, loginUser: LoginUserInfo): BaseResult<Void> {
        userService.updatePassword(req, loginUser)
        return BaseResult.success()
    }


}