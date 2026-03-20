package com.parsec.aika.admin.service.impl

import cn.hutool.core.date.DateUtil
import cn.hutool.core.lang.Assert
import cn.hutool.crypto.digest.DigestUtil
import cn.hutool.jwt.JWTPayload
import cn.hutool.jwt.JWTUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.admin.model.vo.req.AdminUpdatePwdReq
import com.parsec.aika.admin.model.vo.resp.AdminUserResp
import com.parsec.aika.admin.service.AuthService
import com.parsec.aika.admin.service.RoleService
import com.parsec.aika.admin.service.UserService
import com.parsec.aika.common.mapper.UserMapper
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.User
import com.parsec.aika.common.model.vo.LoginResultResp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.validator.utils.PwdUtil
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class AuthServiceImpl : AuthService {

    @Resource
    private lateinit var roleService: RoleService

    @Resource
    private lateinit var userService: UserService

    @Resource
    private lateinit var userMapper: UserMapper

    @Value("\${jwt.key}")
    private lateinit var jwtKey: String

    @Value("\${jwt.expireDays:30}")
    private lateinit var expireDays: String

    private final val SUPPER_ADMIN_ID = 1000000L

    override fun adminLoginByPwd(username: String, password: String): LoginResultResp {
        //查询用户信息
        val queryWrapper = KtQueryWrapper(User::class.java).eq(User::username, username)
        val userInfo = userMapper.selectOne(queryWrapper.last("limit 1"))
        Assert.notNull(userInfo, "Invalid account or password")
        //校验用户状态
        Assert.state(userInfo.userStatus != UserStatus.disabled, "The user has been disabled")
        //校验密码
        Assert.state(DigestUtil.sha256Hex(password) == userInfo.password, "Invalid account or password")
        //校验是否初始密码
        val initPwd = userService.checkInitPwd(userInfo.password!!)
        //生成jwtToken
        return LoginResultResp(
            initPwd, createToken(userInfo, initPwd)
        )
    }

    override fun adminUserInfo(userId: Long): AdminUserResp {
        val vo = userMapper.userInfo(userId)
        Assert.notNull(vo, "用户信息不存在")
        return vo
    }

    override fun adminUpdateFirstPwd(newPwd: String?, loginUser: LoginUserInfo): String {
        Assert.notNull(newPwd, "新密码不能为空")
        // 验证新密码是否是强密码
        Assert.isTrue(PwdUtil.validate(newPwd) > 2, "密码应至少8位，包含大小写字母和数字")
        val userInfo = userMapper.selectById(loginUser.userId)
        Assert.notNull(userInfo, "用户信息不存在")
        userMapper.updateById(User().apply {
            this.id = loginUser.userId
            this.password = DigestUtil.sha256Hex(newPwd)
        })
        //生成jwtToken
        return createToken(userInfo, false)
    }

    override fun adminUpdatePwd(req: AdminUpdatePwdReq, loginUser: LoginUserInfo) {
        Assert.notNull(req.oldPwd, "旧密码不能为空")
        Assert.notNull(req.newPwd, "新密码不能为空")
        // 验证新密码是否是强密码
        Assert.isTrue(PwdUtil.validate(req.newPwd) > 2, "密码应至少8位，包含大小写字母和数字")
        val userInfo = userMapper.selectById(loginUser.userId)
        Assert.notNull(userInfo, "用户信息不存在")
        //校验密码
        Assert.state(DigestUtil.sha256Hex(req.oldPwd) == userInfo.password, "密码错误")
        userMapper.updateById(User().apply {
            this.id = loginUser.userId
            this.password = DigestUtil.sha256Hex(req.newPwd)
        })
    }


    /**
     * 创建token
     */
    private fun createToken(
        userInfo: User, firstLogin: Boolean
    ): String {
        if (userInfo.id != SUPPER_ADMIN_ID) {
            //刷新一下用户对应角色权限
            roleService.refreshRoleResources(userInfo.roleId)
        }
        return JWTUtil.createToken(HashMap<String, Any?>().apply {
            this["userId"] = userInfo.id
            this["username"] = userInfo.username
            this["userType"] = UserTypeEnum.ADMINUSER.name
            this["status"] = userInfo.userStatus!!.name
            this["roleId"] = userInfo.roleId
            this["firstLogin"] = firstLogin
            this[JWTPayload.EXPIRES_AT] = DateUtil.offsetDay(DateUtil.date(), expireDays.toInt())
        }, jwtKey.toByteArray())
    }
}