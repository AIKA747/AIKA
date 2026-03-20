package com.parsec.aika.order.controller.app

import com.parsec.aika.common.mapper.ServicePackageMapper
import com.parsec.aika.common.model.em.ServicePackageStatusEnum
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class AppServicePackageControllerTest {

    @Resource
    private lateinit var servicePackageController: AppServicePackageController

    @Resource
    private lateinit var servicePackageMapper: ServicePackageMapper

//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/service_package_init.sql")
    fun servicePackages() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1000000
            this.userType = UserTypeEnum.APPUSER
        }
        // app端查询列表。查询未删除的、已激活的、可见的服务包
        val result = servicePackageController.servicePackages(PageVo(), loginUser)
        // 能查询出数据
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        result.data.list.map {
            // 验证返回的数据
            val vo = servicePackageMapper.selectById(it.id)
            assertEquals(vo.status, ServicePackageStatusEnum.Active)
            assertEquals(vo.visiblity, true)
        }
    }
}