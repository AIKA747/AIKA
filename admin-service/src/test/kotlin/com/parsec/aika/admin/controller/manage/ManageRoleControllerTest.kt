package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.GetRolesReq
import com.parsec.aika.admin.model.vo.req.PostRoleReq
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

@SpringBootTest
internal class ManageRoleControllerTest {

    @Resource
    private lateinit var manageRoleController: ManageRoleController

    @Test
    @Rollback
    @Transactional
    fun testGetAdminResources() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 新增
        val req = PostRoleReq().apply {
            this.roleName = "role1"
            this.resourceIds = listOf(1, 2, 3)
        }
        manageRoleController.postRole(req, loginUser)
        req.roleName = "role2"
        manageRoleController.postRole(req, loginUser)

        // 列表
        val page = manageRoleController.getRoles(GetRolesReq()).data.list
        assertEquals(page.size, 2)
        assertEquals(page.last().roleName, "role1")
        assertNotNull(page.last().createdAt)

        // 删除
        manageRoleController.deleteRoleId(page.last().id!!)

        // 详情
        val role = manageRoleController.getRoleId(page.first().id!!).data
        assertEquals(role.roleName, "role2")
        assertEquals(role.resourceIds!!.size, 3)

    }
}