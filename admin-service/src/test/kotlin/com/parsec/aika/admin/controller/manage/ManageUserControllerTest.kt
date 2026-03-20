package com.parsec.aika.admin.controller.manage

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.admin.model.vo.req.ManageUserEditVo
import com.parsec.aika.admin.model.vo.req.ManageUserQueryVo
import com.parsec.aika.common.mapper.UserMapper
import cn.hutool.crypto.digest.DigestUtil
import com.parsec.aika.common.model.em.UserStatus
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.User
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import javax.annotation.Resource

@SpringBootTest
internal class ManageUserControllerTest {

    @Resource
    private lateinit var manageUserController: ManageUserController

    @Resource
    private lateinit var userMapper: UserMapper

    private val defaultPwd = "abc123456"

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_user_init.sql")
    fun adminUsers() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.status = UserStatus.enabled
            this.userType = UserTypeEnum.ADMINUSER
        }
        var queryVo = ManageUserQueryVo()
        // 不传入查询条件
        var pageResult = manageUserController.adminUsers(queryVo, loginUser)
        assertEquals(pageResult.code, 0)
        assertTrue(pageResult.data.total > 0)
        // 传入查询条件nickname
        queryVo.nickname = "称443"
        pageResult = manageUserController.adminUsers(queryVo, loginUser)
        assertEquals(pageResult.code, 0)
        assertTrue(pageResult.data.total > 0)
        pageResult.data.list.map {
            assertTrue(it.nickname!!.contains(queryVo.nickname!!))
        }
        // 传入查询条件username
        queryVo = ManageUserQueryVo()
        queryVo.username = "nce"
        pageResult = manageUserController.adminUsers(queryVo, loginUser)
        assertEquals(pageResult.code, 0)
        assertTrue(pageResult.data.total > 0)
        pageResult.data.list.map {
            assertTrue(it.username!!.contains(queryVo.username!!))
        }
        // 传入查询条件roleId
        queryVo = ManageUserQueryVo()
        queryVo.roleId = 1
        pageResult = manageUserController.adminUsers(queryVo, loginUser)
        assertEquals(pageResult.code, 0)
        assertTrue(pageResult.data.total > 0)
        pageResult.data.list.map {
            assertEquals(it.roleId, queryVo.roleId)
        }
        // 传入查询条件时间段
        queryVo = ManageUserQueryVo()
        queryVo.minCreatedTime = "2023-12-01 12:00:22"
        queryVo.maxCreatedTime = "2024-01-01 12:00:22"
        pageResult = manageUserController.adminUsers(queryVo, loginUser)
        assertEquals(pageResult.code, 0)
        assertTrue(pageResult.data.total > 0)
        pageResult.data.list.map {
            assertTrue(it.createdAt!!.isAfter(LocalDateTime.parse(queryVo.minCreatedTime, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
            assertTrue(it.createdAt!!.isBefore(LocalDateTime.parse(queryVo.maxCreatedTime, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
        }
        // 传入组合条件username,nickname
        queryVo = ManageUserQueryVo()
        queryVo.nickname = "昵称"
        queryVo.username = "admin0"
        pageResult = manageUserController.adminUsers(queryVo, loginUser)
        assertEquals(pageResult.code, 0)
        assertTrue(pageResult.data.total > 0)
        pageResult.data.list.map {
            assertTrue(it.nickname!!.contains(queryVo.nickname!!))
            assertTrue(it.username!!.contains(queryVo.username!!))
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_user_init.sql")
    fun adminUserCreateTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.status = UserStatus.enabled
            this.userType = UserTypeEnum.ADMINUSER
        }
        var createVo = ManageUserEditVo()
        // 不传入信息
        try {
            manageUserController.adminUserCreate(createVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "昵称不能为空")
        }
        // 传入昵称，未传入账户。报错
        createVo.nickname = "ccc"
        try {
            manageUserController.adminUserCreate(createVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "账户不能为空")
        }
        // 传入昵称、账户，未传入角色。报错
        createVo.username = "ccddc"
        try {
            manageUserController.adminUserCreate(createVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "角色不能为空")
        }
        // 传入昵称、账户、角色。昵称为已存在的，报错
        createVo.nickname = "管理员昵称66633"
        createVo.roleId = 1
        try {
            manageUserController.adminUserCreate(createVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "昵称已存在")
        }
        // 传入昵称、账户、角色。账户为已存在的，报错
        createVo = ManageUserEditVo()
        createVo.nickname = "管理员昵称7778334"
        createVo.username = "admintest6"
        createVo.roleId = 1
        try {
            manageUserController.adminUserCreate(createVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "账户已存在")
        }
        // 传入的昵称、账户均未存在
        createVo = ManageUserEditVo()
        createVo.nickname = "管理员昵称7778334"
        createVo.username = "admintese764"
        createVo.roleId = 1
        val createResult = manageUserController.adminUserCreate(createVo, loginUser)
        // 保存成功
        assertEquals(createResult.code, 0)
        // 通过昵称查询到该新增的管理员。
        val vo = userMapper.selectOne(KtQueryWrapper(User::class.java).eq(User::nickname, createVo.nickname).last("limit 1"))
        // 查询到的管理员不为空，且字段等于创建传入的字段。默认状态为disabled
        assertNotNull(vo)
        assertEquals(vo.nickname, createVo.nickname)
        assertEquals(vo.username, createVo.username)
        assertEquals(vo.roleId, createVo.roleId)
        assertEquals(vo.creator, loginUser.userId)
        assertEquals(vo.creatorName, loginUser.username)
        assertEquals(vo.userStatus, UserStatus.disabled)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_user_init.sql")
    fun adminUserUpdateTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.status = UserStatus.enabled
            this.userType = UserTypeEnum.ADMINUSER
        }
        var editVo = ManageUserEditVo()
        // 不传入信息
        try {
            manageUserController.adminUserUpdate(editVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "id不能为空")
        }
        // 传入id
        editVo.id = 1111
        try {
            manageUserController.adminUserUpdate(editVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "昵称不能为空")
        }
        // 传入昵称，未传入账户。报错
        editVo.nickname = "ccc"
        try {
            manageUserController.adminUserUpdate(editVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "账户不能为空")
        }
        // 传入昵称、账户，未传入角色。报错
        editVo.username = "ccddc"
        try {
            manageUserController.adminUserUpdate(editVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "角色不能为空")
        }
        // id不存在，报错
        editVo.roleId = 1
        try {
            manageUserController.adminUserUpdate(editVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "管理员信息不存在")
        }
        // 传入id、昵称、账户、角色。昵称为已存在的(除传入id外其他数据存在的)，报错
        editVo.id = 1000005L
        editVo.nickname = "管理员昵称66633"
        try {
            manageUserController.adminUserUpdate(editVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "昵称已存在")
        }
        // 传入id、昵称、账户、角色。账户为已存在的(除传入id外其他数据存在的)，报错
        editVo = ManageUserEditVo()
        editVo.id = 1000005L
        editVo.nickname = "管理员昵称7778334"
        editVo.username = "admintest6"
        editVo.roleId = 1
        try {
            manageUserController.adminUserUpdate(editVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "账户已存在")
        }
        // 传入的昵称、账户均未存在
        editVo = ManageUserEditVo()
        editVo.id = 1000006L
        editVo.nickname = "管理员昵称7778334"
        editVo.username = "admintese764"
        editVo.roleId = 1
        // 修改前，根据id查询到该信息
        var userBefore = userMapper.selectById(editVo.id)
        assertNotNull(userBefore)
        assertNotEquals(userBefore.nickname, editVo.nickname)
        assertNotEquals(userBefore.username, editVo.username)
        var updateResult = manageUserController.adminUserUpdate(editVo, loginUser)
        // 保存成功
        assertEquals(updateResult.code, 0)
        // 通过id查询到修改后的管理员。
        var vo = userMapper.selectById(editVo.id)
        assertNotNull(vo)
        assertEquals(vo.nickname, editVo.nickname)
        assertEquals(vo.username, editVo.username)
        assertEquals(vo.roleId, editVo.roleId)

        // 传入的昵称、账户对应该id下的昵称、账户。即不修改其昵称、账户
        editVo = ManageUserEditVo()
        editVo.id = 1000004L
        editVo.nickname = "昵称4432"
        editVo.username = "admices4"
        editVo.roleId = 3
        // 修改前，根据id查询到该信息
        userBefore = userMapper.selectById(editVo.id)
        assertNotNull(userBefore)
        assertEquals(userBefore.nickname, editVo.nickname)
        assertEquals(userBefore.username, editVo.username)
        assertNotEquals(userBefore.roleId, editVo.roleId)
        updateResult = manageUserController.adminUserUpdate(editVo, loginUser)
        // 保存成功
        assertEquals(updateResult.code, 0)
        // 通过id查询到修改后的管理员。
        vo = userMapper.selectById(editVo.id)
        assertNotNull(vo)
        assertEquals(vo.nickname, editVo.nickname)
        assertEquals(vo.username, editVo.username)
        assertEquals(vo.roleId, editVo.roleId)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_user_init.sql")
    fun adminUserDeleteTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.status = UserStatus.enabled
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入不存在的id
        try {
            manageUserController.adminUserDelete(1222222, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "管理员信息不存在")
        }
        // 传入存在的id
        val id = 1000006L
        // 未调用之前，能查询到管理员信息
        var userVo = userMapper.selectById(id)
        assertNotNull(userVo)
        // 调用删除接口
        val result = manageUserController.adminUserDelete(id, loginUser)
        assertEquals(result.code, 0)
        // 调用后根据id，不能查询到数据
        userVo = userMapper.selectById(id)
        assertNull(userVo)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_user_init.sql")
    fun adminUserDetailTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.status = UserStatus.enabled
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入不存在的id
        try {
            manageUserController.adminUserDetail(1222222, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "管理员信息不存在")
        }
        // 传入存在的id
        val id = 1000006L
        val detailResult = manageUserController.adminUserDetail(id, loginUser)
        assertEquals(detailResult.code, 0)
        val detailVo = detailResult.data
        // 根据id直接查询的数据
        val vo = userMapper.selectById(id)
        // 两种方式查询出来的对象数据内容相同（详情接口的返回数据少些字段）
        assertEquals(detailVo.id, vo.id)
        assertEquals(detailVo.username, vo.username)
        assertEquals(detailVo.nickname, vo.nickname)
        assertEquals(detailVo.roleId, vo.roleId)
        assertEquals(detailVo.avatar, vo.avatar)
        assertEquals(detailVo.createdAt, vo.createdAt)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_user_init.sql")
    fun resetPasswordTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.status = UserStatus.enabled
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入不存在的id
        try {
            manageUserController.resetPassword(112121, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "管理员信息不存在")
        }
        // 传入存在的id
        val id = 1000006L
        val result = manageUserController.resetPassword(id, loginUser)
        assertEquals(result.code, 0)
        // 重置后的密码为默认密码
        val userVo = userMapper.selectById(id)
        assertEquals(userVo.password, DigestUtil.sha256Hex(defaultPwd))
    }
}