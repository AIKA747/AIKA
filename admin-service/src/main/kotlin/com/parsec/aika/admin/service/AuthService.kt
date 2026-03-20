package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.req.AdminUpdatePwdReq
import com.parsec.aika.admin.model.vo.resp.AdminUserResp
import com.parsec.aika.common.model.vo.LoginResultResp
import com.parsec.aika.common.model.vo.LoginUserInfo

interface AuthService {

    /**
     * 管理员账号密码登录
     */
    fun adminLoginByPwd(username: String, password: String): LoginResultResp

    /**
     * 查询当前登录管理员信息
     */
    fun adminUserInfo(userId: Long): AdminUserResp

    /**
     * 修改初始密码
     * 返回新的token（第一次登录标志修改为false）
     */
    fun adminUpdateFirstPwd(newPwd: String?, loginUser: LoginUserInfo): String

    /**
     * 修改密码
     */
    fun adminUpdatePwd(req: AdminUpdatePwdReq, loginUser: LoginUserInfo)

}