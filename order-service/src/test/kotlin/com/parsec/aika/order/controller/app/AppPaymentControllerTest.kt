package com.parsec.aika.order.controller.app

import com.parsec.aika.common.model.em.PayMethodEnum
import com.parsec.aika.common.model.em.PayStatusEnum
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.GetAppPaymentHistoryReq
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource

@SpringBootTest
internal class AppPaymentControllerTest {

    @Resource
    private lateinit var appPaymentController: AppPaymentController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/payment_init.sql")
    fun testGetAppPaymentHistory() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.userType = UserTypeEnum.ADMINUSER
        }
        val result = appPaymentController.getAppPaymentHistory(GetAppPaymentHistoryReq(), loginUser)
        Assertions.assertEquals(result.data.total, 2)
        Assertions.assertEquals(result.data.list.last().payMethod, PayMethodEnum.WeChat)
        Assertions.assertEquals(result.data.list.last().amount, 1.0)
        Assertions.assertEquals(result.data.list.last().payTime, LocalDateTime.parse("2024-01-09T15:37:34"))
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/payment_init.sql")
    fun testGetAppPaymentResult() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.userType = UserTypeEnum.ADMINUSER
        }
        val result = appPaymentController.getAppPaymentResult("123123123", loginUser)
        Assertions.assertEquals(result.data.payMethod, PayMethodEnum.WeChat)
        Assertions.assertEquals(result.data.amount, 1)
        Assertions.assertEquals(result.data.payNo, "123123123")
        Assertions.assertEquals(result.data.orderNo, "123123123")
        Assertions.assertEquals(result.data.status, PayStatusEnum.success)
        Assertions.assertEquals(result.data.callbackTime, LocalDateTime.parse("2024-01-09T15:37:37"))
        Assertions.assertEquals(result.data.creditCard, "3123123")
        Assertions.assertEquals(result.data.createdAt, LocalDateTime.parse("2024-01-09T15:37:49"))
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/payment_init.sql")
    fun getAppPaymentTotalAmount() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 1
            this.userType = UserTypeEnum.ADMINUSER
        }
        val result = appPaymentController.getAppPaymentTotalAmount(loginUser)
        Assertions.assertEquals(result.data, 2)
        val loginUser1 = LoginUserInfo().apply {
            this.userId = 2
            this.userType = UserTypeEnum.ADMINUSER
        }
        val result1 = appPaymentController.getAppPaymentTotalAmount(loginUser1)
        Assertions.assertEquals(result1.data, 0)
    }
}