package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.req.ManageUserEditVo
import com.parsec.aika.admin.model.vo.req.ManageUserQueryVo
import com.parsec.aika.admin.model.vo.resp.ManageUserDetailVo
import com.parsec.aika.admin.model.vo.resp.ManageUserListVo
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

interface UserService {

    /**
     * 管理员列表
     */
    fun manageUsers(req: ManageUserQueryVo): PageResult<ManageUserListVo>

    /**
     * 新增管理员
     */
    fun manageUserCreate(req: ManageUserEditVo, user: LoginUserInfo)

    /**
     * 修改管理员
     */
    fun manageUserUpdate(req: ManageUserEditVo, user: LoginUserInfo)

    /**
     * 删除管理员
     */
    fun manageUserDelete(id: Long, loginUser: LoginUserInfo)

    /**
     * 管理员详情
     */
    fun manageUserDetail(id: Long): ManageUserDetailVo

    /**
     * 重置管理员密码
     */
    fun manageResetPwd(id: Long, user: LoginUserInfo)

    /**
     * 校验是否为管理员初始密码
     */
    fun checkInitPwd(password: String): Boolean

}