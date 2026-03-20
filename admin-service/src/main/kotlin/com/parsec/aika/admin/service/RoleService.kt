package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.req.GetRolesReq
import com.parsec.aika.admin.model.vo.req.PostRoleReq
import com.parsec.aika.admin.model.vo.req.PutRoleReq
import com.parsec.aika.admin.model.vo.resp.GetRoleIdResp
import com.parsec.aika.admin.model.vo.resp.GetRolesResp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

interface RoleService {

    fun postRole(req: PostRoleReq, loginUserInfo: LoginUserInfo)

    fun putRole(req: PutRoleReq, loginUserInfo: LoginUserInfo)

    fun getRoleId(id: Long): GetRoleIdResp

    fun deleteRoleId(id: Long)

    fun getRoles(req: GetRolesReq): PageResult<GetRolesResp>

    /**
     * 刷新角色资源
     */
    fun refreshRoleResources(roleId: Long?)


}