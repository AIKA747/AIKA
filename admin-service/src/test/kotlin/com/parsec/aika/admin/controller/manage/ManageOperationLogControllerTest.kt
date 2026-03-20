package com.parsec.aika.admin.controller.manage

import org.springframework.boot.test.context.SpringBootTest
import javax.annotation.Resource

@SpringBootTest
internal class ManageOperationLogControllerTest {

    @Resource
    private lateinit var manageOperationLogController: ManageOperationLogController

//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/operation_log_init.sql")
//    fun testGetOperationLogs() {
//        val loginUser = LoginUserInfo().apply {
//            this.userId = 1
//            this.userType = UserTypeEnum.ADMINUSER
//        }
//        val result = manageOperationLogController.getOperationLogs(GetOperationLogsReq().apply {
//            this.username = "yyl"
//            this.action = OperationActionEnum.add
//            this.module = "module"
//            this.minOperatedTime = "2024-01-11 14:31:39"
//            this.maxOperatedTime = "2024-01-11 16:31:39"
//            this.record = "record"
//        }, loginUser).data.list.last()
//        assertEquals(result.action, OperationActionEnum.add)
//        assertEquals(result.record, "record")
//        assertEquals(result.finalValue, "2")
//        assertEquals(result.initialValue, "1")
//        assertEquals(result.module, "module")
//        assertEquals(result.adminName, "yyl")
//
//    }
}