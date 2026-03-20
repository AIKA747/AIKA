package com.parsec.aika.admin.controller

import cn.hutool.crypto.digest.DigestUtil
import cn.hutool.jwt.JWTUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.admin.model.vo.req.AdminLoginByPwdReq
import com.parsec.aika.admin.model.vo.req.AdminUpdatePwdReq
import com.parsec.aika.admin.service.AuthService
import com.parsec.aika.common.mapper.UserMapper
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.User
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class AuthControllerTest {

    @Resource
    private lateinit var authController: AuthController

    @Resource
    private lateinit var authService: AuthService

    @Resource
    private lateinit var userMapper: UserMapper

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/auth_user_login.sql")
    fun adminLogin() {
        // 账号密码登录，传入错误账号
        val loginReq = AdminLoginByPwdReq().apply {
            this.username = "23425"
            this.password = "111111111"
        }
        try {
            authService.adminLoginByPwd(loginReq.username!!, loginReq.password!!)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "用户信息不存在")
        }
        // 传入被禁用的账号密码
        loginReq.username = "admin00001"
        loginReq.password = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
        try {
            authService.adminLoginByPwd(loginReq.username!!, loginReq.password!!)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The user has been disabled")
        }
        // 传入错误的密码，账号正确
        loginReq.username = "admin00002"
        loginReq.password = "123433356"
        try {
            authService.adminLoginByPwd(loginReq.username!!, loginReq.password!!)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "密码错误")
        }
        // 传入正确的账号密码----弱密码
        loginReq.username = "admin00002"
        loginReq.password = "123456"
        var loginResult = authService.adminLoginByPwd(loginReq.username!!, loginReq.password!!)
        // 解析返回的token，由于传入的是弱密码，返回token中的firstLogin字段为true
        var user =
            userMapper.selectOne(KtQueryWrapper(User::class.java).eq(User::username, loginReq.username).last("limit 1"))
        var payload = JWTUtil.parseToken(loginResult.token).payload
        assertEquals(payload.getClaim("userId").toString(), user.id.toString())
        assertEquals(payload.getClaim("username").toString(), user.username.toString())
        assertEquals(payload.getClaim("userType").toString(), UserTypeEnum.ADMINUSER.name)
        assertEquals(payload.getClaim("status").toString(), user.userStatus.toString())
        assertTrue(payload.getClaim("firstLogin").toString() == "true")

        /// 传入正确的账号密码----强密码
        loginReq.username = "admin00003"
        loginReq.password = "Paweds@!136543"
        loginResult = authService.adminLoginByPwd(loginReq.username!!, loginReq.password!!)
        // 解析返回的token，由于传入的是强密码，返回token中的firstLogin字段为false
        user =
            userMapper.selectOne(KtQueryWrapper(User::class.java).eq(User::username, loginReq.username).last("limit 1"))
        payload = JWTUtil.parseToken(loginResult.token).payload
        assertEquals(payload.getClaim("userId").toString(), user.id.toString())
        assertEquals(payload.getClaim("username").toString(), user.username.toString())
        assertEquals(payload.getClaim("userType").toString(), UserTypeEnum.ADMINUSER.name)
        assertEquals(payload.getClaim("status").toString(), user.userStatus.toString())
        assertTrue(payload.getClaim("firstLogin").toString() == "false")
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/auth_user_login.sql")
    fun currentUserInfoTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1122332211
        }
        // 传入错误的userId，报错
        try {
            authController.currentUserInfo(loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "用户信息不存在")
        }
        // 传入存在的userId
        loginUser.userId = 1000003
        val result = authController.currentUserInfo(loginUser)
        assertEquals(result.code, 0)
        val resultUser = result.data
        val user = userMapper.selectById(loginUser.userId)
        assertEquals(resultUser.username, user.username)
        assertEquals(resultUser.nickname, user.nickname)
        assertEquals(resultUser.roleId, user.roleId)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/auth_user_login.sql")
    fun adminUpdateFirstPwdTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 111212
        }
        val reqVo = AdminUpdatePwdReq()
        // 不传入新密码，报错
        try {
            authController.adminUpdateFirstPwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "新密码不能为空")
        }
        // 传入的新密码不是强密码（未完全包含大小写字母、数字或未到8位），报错
        reqVo.newPwd = "aaad"
        try {
            authController.adminUpdateFirstPwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "密码应至少8位，包含大小写字母和数字")
        }
        // 密码未到8位
        reqVo.newPwd = "aa32Ad"
        try {
            authController.adminUpdateFirstPwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "密码应至少8位，包含大小写字母和数字")
        }
        // 传入强密码，但用户id不对
        reqVo.newPwd = "ad2#6A4DTes"
        try {
            authController.adminUpdateFirstPwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "用户信息不存在")
        }
        // 用户id正确
        loginUser.userId = 1000002
        val result = authController.adminUpdateFirstPwd(reqVo, loginUser)
        assertEquals(result.code, 0)
        // 解析返回的新token，返回token中的firstLogin字段为false
        val user = userMapper.selectById(loginUser.userId)
        val payload = JWTUtil.parseToken(result.data).payload
        assertEquals(payload.getClaim("userId").toString(), user.id.toString())
        assertEquals(payload.getClaim("username").toString(), user.username.toString())
        assertEquals(payload.getClaim("userType").toString(), UserTypeEnum.ADMINUSER.name)
        assertEquals(payload.getClaim("status").toString(), user.userStatus.toString())
        assertTrue(payload.getClaim("firstLogin").toString() == "false")
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/auth_user_login.sql")
    fun adminUpdatePwdTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 111212
        }
        val reqVo = AdminUpdatePwdReq()
        // 不传入旧密码，报错
        try {
            authController.adminUpdatePwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "旧密码不能为空")
        }
        // 不传入新密码，报错
        reqVo.oldPwd = "21345"
        try {
            authController.adminUpdatePwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "新密码不能为空")
        }
        // 新密码强度不够，报错
        reqVo.oldPwd = "21345"
        reqVo.newPwd = "213asdf45"
        try {
            authController.adminUpdatePwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "密码应至少8位，包含大小写字母和数字")
        }
        // 传入强密码，但用户id不对
        reqVo.newPwd = "ad2#6A4DTes"
        try {
            authController.adminUpdatePwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "用户信息不存在")
        }
        // 用户id正确，但旧密码不正确，报错
        loginUser.userId = 1000003
        try {
            authController.adminUpdatePwd(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "密码错误")
        }
        // 正确的旧密码，修改密码成功
        reqVo.oldPwd = "Paweds@!136543"
        val result = authController.adminUpdatePwd(reqVo, loginUser)
        assertEquals(result.code, 0)
        // 根据id直接查询用户，新查询到的用户密码为传入的新密码
        val user = userMapper.selectById(loginUser.userId)
        assertEquals(user.password, DigestUtil.sha256Hex(reqVo.newPwd))
    }
}