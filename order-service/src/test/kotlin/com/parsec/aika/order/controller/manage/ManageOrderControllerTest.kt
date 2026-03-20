package com.parsec.aika.order.controller.manage

import com.parsec.aika.common.model.em.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.GetManageCountryIncomeRankingReq
import com.parsec.aika.order.model.vo.req.GetManageOrdersReq
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.Resource

@SpringBootTest
internal class ManageOrderControllerTest {

    @Resource
    private lateinit var manageOrderController: ManageOrderController

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/order_init.sql", "/sql/payment_init.sql")
    fun testGetManageOrderId() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        val data = manageOrderController.getManageOrderId(1, loginUser).data
        Assertions.assertEquals(data.orderNo, "123123123")
        Assertions.assertEquals(data.userId, 1)
        Assertions.assertEquals(data.username, "yyl")
        Assertions.assertEquals(data.phone, "18375729810")
        Assertions.assertEquals(data.email, "123@163.com")
        Assertions.assertEquals(data.amount, 1)
        Assertions.assertEquals(data.packageId, 1)
        Assertions.assertEquals(data.packageName, "pack")
        Assertions.assertEquals(data.status, OrderStatusEnum.Success)
        Assertions.assertEquals(data.callbackAt, LocalDateTime.parse("2024-01-09T16:47:57"))
        Assertions.assertEquals(data.cancelAt, LocalDateTime.parse("2024-01-09T16:47:59"))
        Assertions.assertEquals(data.createdAt, LocalDateTime.parse("2024-01-09T16:48:11"))
        Assertions.assertEquals(data.updatedAt, LocalDateTime.parse("2024-01-09T16:48:17"))
        Assertions.assertEquals(data.paymentInfo!!.last().payMethod, PayMethodEnum.WeChat)
        Assertions.assertEquals(data.paymentInfo!!.last().amount, 1)
        Assertions.assertEquals(data.paymentInfo!!.last().payNo, "123123123")
        Assertions.assertEquals(data.paymentInfo!!.last().status, PayStatusEnum.success)
        Assertions.assertEquals(data.paymentInfo!!.last().payTime, LocalDateTime.parse("2024-01-09T15:37:34"))
        Assertions.assertEquals(data.paymentInfo!!.last().callbackTime, LocalDateTime.parse("2024-01-09T15:37:37"))
        Assertions.assertEquals(data.paymentInfo!!.last().creditCard, "3123123")
        Assertions.assertEquals(data.paymentInfo!!.last().type, PayTypeEnum.Payment)

    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/order_init.sql", "/sql/payment_init.sql")
    fun testGetManageOrders() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        val data = manageOrderController.getManageOrders(GetManageOrdersReq().apply {
            this.orderNo = "123123123"
            this.username = "yyl"
            this.email = "163"
            this.phone = "183"
            this.status = OrderStatusEnum.Success
            this.minCreatedAt = "2024-01-09 10:48:11"
            this.maxCreatedAt = "2024-01-09 17:48:11"
            this.payMethod = PayMethodEnum.WeChat
            this.minPayTime = "2024-01-09 10:48:11"
            this.maxPayTime = "2024-01-09 17:48:11"
        }, loginUser).data.list

        Assertions.assertEquals(data.last().orderNo, "123123123")
        Assertions.assertEquals(data.last().username, "yyl")
        Assertions.assertEquals(data.last().amount, 1.0)
        Assertions.assertEquals(data.last().status, OrderStatusEnum.Success)
        Assertions.assertEquals(data.last().createdAt, LocalDateTime.parse("2024-01-09T16:48:11"))


    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/order_init.sql")
    fun testGetManageCountryIncomeRanking() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        val data =
            manageOrderController.getManageCountryIncomeRanking(GetManageCountryIncomeRankingReq(), loginUser).data.list

        Assertions.assertEquals(data.last().country, "china")
        Assertions.assertEquals(data.last().data, 2.0)
    }
}