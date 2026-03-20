package com.parsec.aika.admin.controller.manage

import cn.hutool.core.lang.Assert
import com.parsec.aika.admin.model.vo.req.ManageUserEditVo
import com.parsec.aika.admin.model.vo.req.ManageUserQueryVo
import com.parsec.aika.admin.model.vo.resp.ManageUserDetailVo
import com.parsec.aika.admin.model.vo.resp.ManageUserListVo
import com.parsec.aika.admin.service.UserService
import com.parsec.aika.common.model.vo.LoginUserInfo
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
     * 管理员列表
     */
    @GetMapping("/users")
    fun adminUsers(req: ManageUserQueryVo, user: LoginUserInfo): BaseResult<PageResult<ManageUserListVo>> {
        return BaseResult.success(userService.manageUsers(req))
    }

    /**
     * 删除管理员
     */
    @DeleteMapping("/user/{id}")
    fun adminUserDelete(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        userService.manageUserDelete(id, user)
        return BaseResult.success()
    }

    /**
     * 管理员详情
     */
    @GetMapping("/user/{id}")
    fun adminUserDetail(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<ManageUserDetailVo> {
        return BaseResult.success(userService.manageUserDetail(id))
    }


    /**
     * 新增管理员
     */
    @PostMapping("/user")
    fun adminUserCreate(@Validated @RequestBody req: ManageUserEditVo, user: LoginUserInfo): BaseResult<Void> {
        userService.manageUserCreate(req, user)
        return BaseResult.success()
    }


    /**
     * 修改管理员
     */
    @PutMapping("/user")
    fun adminUserUpdate(@Validated @RequestBody req: ManageUserEditVo, user: LoginUserInfo): BaseResult<Void> {
        Assert.notNull(req.id, "id not null")
        userService.manageUserUpdate(req, user)
        return BaseResult.success()
    }


    /**
     * 重置密码
     */
    @PatchMapping("/user/{id}")
    fun resetPassword(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        userService.manageResetPwd(id, user)
        return BaseResult.success()
    }


}