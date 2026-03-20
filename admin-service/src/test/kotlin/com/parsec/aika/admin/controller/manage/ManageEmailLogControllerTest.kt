package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.GetEmailLogsReq
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource
import kotlin.test.assertEquals

@SpringBootTest
internal class ManageEmailLogControllerTest {

    @Resource
    private lateinit var manageEmailLogController: ManageEmailLogController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/email_log_init.sql")
    fun testGetEmailLogs() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.userType = UserTypeEnum.ADMINUSER
        }
        val result = manageEmailLogController.getEmailLogs(GetEmailLogsReq().apply {
            this.status = "success"
            this.email = "123"
            this.content = "zheshineirong"
            this.minSendTime = "2024-01-11T15:05:16"
            this.maxSendTime = "2024-01-11T17:05:16"
        }, loginUser).data.list.last()
        assertEquals(result.status, "success")
        assertEquals(result.email, "123@qq.com")
        assertEquals(result.content, "zheshineirong")
        assertEquals(result.sendTime, LocalDateTime.parse("2024-01-11T16:05:16"))
    }
}