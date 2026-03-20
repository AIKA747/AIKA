package com.parsec.aika.admin.controller

import com.parsec.aika.admin.model.vo.req.AdminLoginByPwdReq
import com.parsec.aika.admin.model.vo.req.AdminUpdatePwdReq
import com.parsec.aika.admin.model.vo.resp.AdminUserResp
import com.parsec.aika.admin.model.vo.resp.GetAdminResourcesResp
import com.parsec.aika.admin.service.AuthService
import com.parsec.aika.admin.service.ResourcesService
import com.parsec.aika.admin.service.ValidateImageCodeService
import com.parsec.aika.common.model.vo.LoginResultResp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AuthController {

    @Resource
    private lateinit var authService: AuthService

    @Resource
    private lateinit var resourcesService: ResourcesService

    @Resource
    private lateinit var validateImageCodeService: ValidateImageCodeService

    /**
     * 管理员登录
     */
    @PostMapping("/public/login")
    fun adminLogin(@RequestBody @Validated req: AdminLoginByPwdReq): BaseResult<LoginResultResp> {
        //验证校验码
        validateImageCodeService.check(req.clientCode!!, req.verifyCode!!)
        // 实现逻辑
        return BaseResult.success(authService.adminLoginByPwd(req.username!!, req.password!!))
    }

    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/me")
    fun currentUserInfo(userInfo: LoginUserInfo): BaseResult<AdminUserResp> {
        return BaseResult.success(authService.adminUserInfo(userInfo.userId!!))
    }

    /**
     * 修改初始密码
     */
    @PatchMapping("/first/pwd")
    fun adminUpdateFirstPwd(
        @Validated @RequestBody req: AdminUpdatePwdReq, loginUser: LoginUserInfo
    ): BaseResult<String> {
        return BaseResult.success(authService.adminUpdateFirstPwd(req.newPwd, loginUser))
    }

    /**
     * 修改密码
     */
    @PatchMapping("/pwd")
    fun adminUpdatePwd(@Validated @RequestBody req: AdminUpdatePwdReq, loginUser: LoginUserInfo): BaseResult<Void> {
        authService.adminUpdatePwd(req, loginUser)
        return BaseResult.success()
    }

    @GetMapping("/current/resources")
    fun currentUserResource(loginUser: LoginUserInfo): BaseResult<List<GetAdminResourcesResp>> {
        return BaseResult.success(resourcesService.currentUserResource(loginUser.userId!!))
    }

}