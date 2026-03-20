package com.parsec.aika.order.endpint

import com.parsec.aika.common.mapper.OrderMapper
import com.parsec.aika.common.model.em.OrderStatusEnum
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.order.model.vo.req.OrderEndpointQueryVo
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import javax.annotation.Resource

@SpringBootTest
internal class OrderEndpointTest {

    @Resource
    private lateinit var orderEndpoint: OrderEndpoint

    @Resource
    private lateinit var orderMapper: OrderMapper

//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/endpoint_order_init.sql")
    fun userSubscriptions() {
        val loginUser = LoginUserInfo().apply{
            this.userId = 100
            this.username = "测试app用户001"
            this.userType = UserTypeEnum.APPUSER
        }
        // 不传入查询条件，直接查询出所有用户最新的一条成功订单数据
        var result = orderEndpoint.userSubscriptions(OrderEndpointQueryVo())
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 查询出来的订单状态都为success
        result.data.list.map {
            val order = orderMapper.selectById(it.orderId)
            assertEquals(order.status, OrderStatusEnum.Success)
        }

        var queryVo = OrderEndpointQueryVo()
        // 传入查询条件：username
        queryVo.username = "测试1"
        result = orderEndpoint.userSubscriptions(queryVo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 查询出来的订单状态都为success，且每条数据的用户名称都包含传入的查询名称
        result.data.list.map {
            val order = orderMapper.selectById(it.orderId)
            assertEquals(order.status, OrderStatusEnum.Success)
            assertTrue(order.username!!.contains(queryVo.username!!))
        }

        // 传入查询条件：username、subStatus
        queryVo.subStatus = "Valid"
        result = orderEndpoint.userSubscriptions(queryVo)
        assertEquals(result.code, 0)
        // 查询出来的订单状态都为success，且每条数据都满足查询条件
        result.data.list.map {
            val order = orderMapper.selectById(it.orderId)
            assertEquals(order.status, OrderStatusEnum.Success)
            assertTrue(order.username!!.contains(queryVo.username!!))
            assertTrue(order.expiredAt!!.isAfter(LocalDateTime.now()))
        }

        // 传入查询条件：username、subStatus
        queryVo.subStatus = "Expired"
        result = orderEndpoint.userSubscriptions(queryVo)
        assertEquals(result.code, 0)
        // 查询出来的订单状态都为success，且每条数据都满足查询条件
        result.data.list.map {
            val order = orderMapper.selectById(it.orderId)
            assertEquals(order.status, OrderStatusEnum.Success)
            assertTrue(order.username!!.contains(queryVo.username!!))
            assertTrue(order.expiredAt!!.isBefore(LocalDateTime.now()))
        }

        // 传入查询条件：email、phone
        queryVo = OrderEndpointQueryVo()
        queryVo.email = "3445"
        queryVo.phone = "222"
        result = orderEndpoint.userSubscriptions(queryVo)
        assertEquals(result.code, 0)
        // 查询出来的订单状态都为success，且每条数据都满足查询条件
        result.data.list.map {
            val order = orderMapper.selectById(it.orderId)
            assertEquals(order.status, OrderStatusEnum.Success)
            assertTrue(order.email!!.contains(queryVo.email!!))
            assertTrue(order.phone!!.contains(queryVo.phone!!))
        }

        // 传入查询条件：groupId、maxSubscriptionTime、minSubscriptionTime时间段范围查询
        queryVo = OrderEndpointQueryVo()
        queryVo.groupId = 1001
        queryVo.maxSubscriptionTime = "2024-11-11 12:22:23"
        queryVo.minSubscriptionTime = "2024-01-01 01:33:44"
        result = orderEndpoint.userSubscriptions(queryVo)
        assertEquals(result.code, 0)
        // 查询出来的订单状态都为success，且每条数据都满足查询条件
        result.data.list.map {
            val order = orderMapper.selectById(it.orderId)
            assertEquals(order.status, OrderStatusEnum.Success)
            assertEquals(order.groupId, queryVo.groupId!!)
            assertTrue(order.callbackAt!!.isAfter(LocalDateTime.parse(queryVo.minSubscriptionTime, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
            assertTrue(order.callbackAt!!.isBefore(LocalDateTime.parse(queryVo.maxSubscriptionTime, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
        }

        // 传入查询条件username、remainingDays
        queryVo = OrderEndpointQueryVo()
        queryVo.username = "测试1"
        queryVo.remainingDays = 70
        result = orderEndpoint.userSubscriptions(queryVo)
        assertEquals(result.code, 0)
        // 查询出来的订单状态都为success，且每条数据都满足查询条件
        result.data.list.map {
            val order = orderMapper.selectById(it.orderId)
            assertEquals(order.status, OrderStatusEnum.Success)
            assertTrue(order.username!!.contains(queryVo.username!!))
            // 剩余过期时间 与 当前时间的相差天数
            // 查询条件中的剩余天数，是剩余过期时间 - 当前时间 相差天数 <= 传入的remainingDays
            val betweenDays = ChronoUnit.DAYS.between(LocalDateTime.now(), order.expiredAt)
            println("相差天数：${betweenDays}")
            assertTrue(betweenDays <= queryVo.remainingDays!!)
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/service_package_init.sql")
    fun testGetFeignUserSubscription() {
        /**
         *  假定服务包时长为30d
         * 【用户100】 23年1月9日开通服务包，2月8日续费，测试结果应为订阅时间：2023-01-09 16:47:57，到期时间：2023-01-09 16:47:57 + 60d
         * 【用户101】 23年1月7日开通服务包，次月未续费，3月12日再次开通服务包，4月1日续费，测试结果应为订阅时间：2023-03-12 16:47:57，到期时间：2023-03-12 16:47:57 + 60d
         */
        var list = orderEndpoint.getFeignUserSubscription(100).data
        assertEquals(LocalDateTime.parse("2023-01-09T16:47:57"), list.last().subscriptTime)
        assertEquals(LocalDateTime.parse("2023-01-09T16:47:57").plusDays(60), list.last().expiredDate)

        list = orderEndpoint.getFeignUserSubscription(101).data
        assertEquals(LocalDateTime.parse("2023-03-12T16:47:57"), list.last().subscriptTime)
        assertEquals(LocalDateTime.parse("2023-03-12T16:47:57").plusDays(60), list.last().expiredDate)

        // 用户订阅过期时间
//        assertEquals(LocalDateTime.parse("2023-01-09T16:47:57").plusDays(60), orderEndpoint.getFeignUserSubscriptionExpiredTime(100).data)
//        assertEquals(LocalDateTime.parse("2023-03-12T16:47:57").plusDays(60), orderEndpoint.getFeignUserSubscriptionExpiredTime(101).data)
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/endpoint_order_init.sql")
    fun getFeignIncomeData() {
        val feignIncomeData = orderEndpoint.getFeignIncomeData("2024-01-09", "china")
        assertEquals(1, feignIncomeData.data.income)
        assertEquals(2, feignIncomeData.data.totalIncome)
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/endpoint_order_init2.sql")
    fun getFeignSubData() {
        val feignIncomeData = orderEndpoint.getFeignSubscribersData("2024-01-09", "china")
        assertEquals(3, feignIncomeData.data.newSubscribers)
        assertEquals(4, feignIncomeData.data.totalSubscribers)
        assertEquals(3, feignIncomeData.data.expiredSubscribers)
        assertEquals(3, feignIncomeData.data.totalExpiredSubscribers)
        assertEquals(4, feignIncomeData.data.upcomingExpiringSubscribers)
    }
}