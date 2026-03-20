package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.GetSmsLogsReq
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
internal class ManageSmsLogControllerTest {

    @Resource
    private lateinit var manageSmsLogController: ManageSmsLogController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/sms_log_init.sql")
    fun testGetSmsLogs() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.userType = UserTypeEnum.ADMINUSER
        }
        val result = manageSmsLogController.getSmsLogs(GetSmsLogsReq().apply {
            this.status = true
            this.phone = "183"
            this.content = "duanxin"
            this.minSendTime = "2024-01-11T15:05:16"
            this. maxSendTime = "2024-01-11T17:05:16"
        }, loginUser).data.list.last()
        assertEquals(result.status, true)
        assertEquals(result.phone, "18375729810")
        assertEquals(result.content, "duanxin")
        assertEquals(result.sendTime, LocalDateTime.parse("2024-01-11T15:53:05"))
    }
}