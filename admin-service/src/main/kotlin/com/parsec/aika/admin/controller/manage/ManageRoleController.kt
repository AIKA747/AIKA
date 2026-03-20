package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.GetRolesReq
import com.parsec.aika.admin.model.vo.req.PostRoleReq
import com.parsec.aika.admin.model.vo.req.PutRoleReq
import com.parsec.aika.admin.model.vo.resp.GetRoleIdResp
import com.parsec.aika.admin.model.vo.resp.GetRolesResp
import com.parsec.aika.admin.service.RoleService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageRoleController {

    @Resource
    private lateinit var roleService: RoleService


    @PostMapping("/role")
    fun postRole(@RequestBody @Validated req: PostRoleReq, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        roleService.postRole(req, loginUserInfo)
        return BaseResult.success()
    }

    @PutMapping("/role")
    fun putRole(@RequestBody @Validated req: PutRoleReq, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        roleService.putRole(req, loginUserInfo)
        return BaseResult.success()
    }

    @GetMapping("/role/{id}")
    fun getRoleId(@PathVariable id: Long): BaseResult<GetRoleIdResp> {
        return BaseResult.success(roleService.getRoleId(id))
    }

    @DeleteMapping("/role/{id}")
    fun deleteRoleId(@PathVariable id: Long): BaseResult<Void> {
        roleService.deleteRoleId(id)
        return BaseResult.success()
    }

    @GetMapping("/roles")
    fun getRoles(req: GetRolesReq): BaseResult<PageResult<GetRolesResp>> {
        return BaseResult.success(roleService.getRoles(req))
    }
}