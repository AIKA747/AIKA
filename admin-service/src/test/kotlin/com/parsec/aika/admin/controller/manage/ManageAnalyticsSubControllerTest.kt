package com.parsec.aika.admin.controller.manage

import com.parsec.aika.common.mapper.AnalysisMapper
import com.parsec.aika.common.model.entity.Analysis
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.annotation.Resource
import kotlin.test.assertEquals

@SpringBootTest
internal class ManageAnalyticsSubControllerTest {

    @Resource
    private lateinit var manageAnalyticsSubController: ManageAnalyticsSubController

    @Resource
    private lateinit var analysisMapper: AnalysisMapper

    private fun init(date: LocalDate) {
        val dayId = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"))
        listOf(
            Analysis().apply {
                this.dayId = dayId;this.country = "china";this.newSubscribers = 10;this.expiredSubscribers =
                5;this.totalSubscribers = 20;this.upcomingExpiringSubscribers = 10;this.totalExpiredSubscribers =
                5;this.totalUsers = 25;this.newUsers = 5;this.activeUsers = 10;this.inactiveUsers = 10;this.income =
                100;this.totalIncome = 920384742;this.createdAt = date.atStartOfDay()
            },
            Analysis().apply {
                this.dayId = dayId;this.country = "usa";this.newSubscribers = 10;this.expiredSubscribers =
                5;this.totalSubscribers = 20;this.upcomingExpiringSubscribers = 10;this.totalExpiredSubscribers =
                5;this.totalUsers = 25;this.newUsers = 5;this.activeUsers = 10;this.inactiveUsers = 10;this.income =
                100;this.totalIncome = 920384742;this.createdAt = date.atStartOfDay()
            },
            Analysis().apply {
                this.dayId = dayId;this.country = "japan";this.newSubscribers = 10;this.expiredSubscribers =
                5;this.totalSubscribers = 20;this.upcomingExpiringSubscribers = 10;this.totalExpiredSubscribers =
                5;this.totalUsers = 25;this.newUsers = 5;this.activeUsers = 10;this.inactiveUsers = 10;this.income =
                100;this.totalIncome = 920384742;this.createdAt = date.atStartOfDay()
            },
            Analysis().apply {
                this.dayId = dayId;this.country = "uk";this.newSubscribers = 10;this.expiredSubscribers =
                5;this.totalSubscribers = 20;this.upcomingExpiringSubscribers = 10;this.totalExpiredSubscribers =
                5;this.totalUsers = 25;this.newUsers = 5;this.activeUsers = 10;this.inactiveUsers = 10;this.income =
                100;this.totalIncome = 920384742;this.createdAt = date.atStartOfDay()
            },
        ).forEach { analysisMapper.insert(it) }
    }

    @Test
    @Rollback
    @Transactional
    fun testGetAnalyticsSubscribersNum() {
        init(LocalDate.now().minusDays(1))
        val data = manageAnalyticsSubController.getAnalyticsSubscribersNum(LoginUserInfo()).data
        assertEquals(100, data.totalUsers)
        assertEquals(80, data.totalSubscribers)
        assertEquals(20, data.totalExpiredSubscribers)
        assertEquals(40, data.upcomingExpiringSubscribers)
    }

    @Test
    @Rollback
    @Transactional
    fun testGetAnalyticsNewSubscribersMonth() {
        init(LocalDate.now())
        init(LocalDate.now())
        init(LocalDate.now().minusMonths(1))
        val data = manageAnalyticsSubController.getAnalyticsNewSubscribersMonth(LoginUserInfo()).data
        assertEquals(80, data.newSubscribers)
        assertEquals(60, data.monthlyNewSubscribers)
        assertEquals("100%", data.momChange)
    }

    @Test
    @Rollback
    @Transactional
    fun testGetAnalyticsNewSubscribersWeek() {
        init(LocalDate.now())
        init(LocalDate.now())
        init(LocalDate.now().minusWeeks(1))
        val data = manageAnalyticsSubController.getAnalyticsNewSubscribersWeek(LoginUserInfo()).data
        assertEquals(80, data.newSubscribers)
        assertEquals("100%", data.wowChange)
        assertEquals(80, data.dailyNewSubscribers)
        assertEquals("0%", data.dodChange)
    }

    @Test
    @Rollback
    @Transactional
    fun testGetAnalyticsIncomeYear() {
        init(LocalDate.now())
        init(LocalDate.now().minusYears(1))
        init(LocalDate.now().minusYears(1))
        val data = manageAnalyticsSubController.getAnalyticsIncomeYear(LoginUserInfo()).data
        assertEquals(400, data.income)
        assertEquals("-50%", data.yoyChange)
        assertEquals(600, data.annualIncome)
    }

    @Test
    @Rollback
    @Transactional
    fun testGetAnalyticsIncomeMonth() {
        init(LocalDate.now())
        init(LocalDate.now())
        init(LocalDate.now().minusMonths(1))
        val data = manageAnalyticsSubController.getAnalyticsIncomeMonth(LoginUserInfo()).data
        assertEquals(800, data.income)
        assertEquals("100%", data.momChange)
        assertEquals(600, data.monthlyIncome)
    }

    @Test
    @Rollback
    @Transactional
    fun testGetAnalyticsIncomeWeek() {
        init(LocalDate.now())
        init(LocalDate.now())
        init(LocalDate.now().minusWeeks(1))
        val data = manageAnalyticsSubController.getAnalyticsIncomeWeek(LoginUserInfo()).data
        assertEquals(800, data.income)
        assertEquals("100%", data.wowChange)
        assertEquals(800, data.dailyIncome)
    }


}