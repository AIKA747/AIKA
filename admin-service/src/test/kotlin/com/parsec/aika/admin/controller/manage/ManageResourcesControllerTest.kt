package com.parsec.aika.admin.controller.manage

import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource
import kotlin.test.assertNotNull

@SpringBootTest
internal class ManageResourcesControllerTest {

    @Resource
    private lateinit var manageResourcesController: ManageResourcesController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/resources_init.sql")
    fun testGetAdminResources() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.userType = UserTypeEnum.ADMINUSER
        }
        val result = manageResourcesController.getAdminResources().data.last().childrens?.last()?.childrens?.last()
        assertNotNull(result)
    }
}