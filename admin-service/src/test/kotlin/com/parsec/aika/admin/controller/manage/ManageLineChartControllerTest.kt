package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.LineChartReq
import com.parsec.aika.common.mapper.AnalysisMapper
import com.parsec.aika.common.model.entity.Analysis
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.annotation.Resource
import kotlin.test.assertEquals

@SpringBootTest
internal class ManageLineChartControllerTest {

    @Resource
    private lateinit var manageLineChartController: ManageLineChartController

    @Resource
    private lateinit var analysisMapper: AnalysisMapper

    private fun init(date: LocalDate) {
        val dayId = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"))
        listOf(
            Analysis().apply {
                this.dayId = dayId;this.country = "china";this.newSubscribers = 10;this.expiredSubscribers =
                5;this.totalSubscribers = 50;this.upcomingExpiringSubscribers = 10;this.totalExpiredSubscribers =
                5;this.totalUsers = 25;this.newUsers = 5;this.activeUsers = 10;this.inactiveUsers = 10;this.income =
                100;this.totalIncome = 20384742;this.createdAt = date.atStartOfDay()
            },
            Analysis().apply {
                this.dayId = dayId;this.country = "usa";this.newSubscribers = 10;this.expiredSubscribers =
                5;this.totalSubscribers = 30;this.upcomingExpiringSubscribers = 10;this.totalExpiredSubscribers =
                5;this.totalUsers = 25;this.newUsers = 5;this.activeUsers = 10;this.inactiveUsers = 10;this.income =
                100;this.totalIncome = 920742;this.createdAt = date.atStartOfDay()
            },
            Analysis().apply {
                this.dayId = dayId;this.country = "japan";this.newSubscribers = 10;this.expiredSubscribers =
                5;this.totalSubscribers = 40;this.upcomingExpiringSubscribers = 10;this.totalExpiredSubscribers =
                5;this.totalUsers = 25;this.newUsers = 5;this.activeUsers = 10;this.inactiveUsers = 10;this.income =
                100;this.totalIncome = 384742;this.createdAt = date.atStartOfDay()
            },
            Analysis().apply {
                this.dayId = dayId;this.country = "uk";this.newSubscribers = 10;this.expiredSubscribers =
                5;this.totalSubscribers = 10;this.upcomingExpiringSubscribers = 10;this.totalExpiredSubscribers =
                5;this.totalUsers = 25;this.newUsers = 5;this.activeUsers = 10;this.inactiveUsers = 10;this.income =
                100;this.totalIncome = 92042;this.createdAt = date.atStartOfDay()
            },
        ).forEach { analysisMapper.insert(it) }
    }

    val req = LineChartReq().apply {
        this.startDate = "20240101"
        this.endDate = "20240110"
    }

    val loginUserInfo = LoginUserInfo().apply {
        this.userId = 100001
        this.username = "admin"
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/analysis_init.sql")
    fun getTotalSubscribersLineChart() {
        val result = manageLineChartController.getTotalSubscribersLineChart(req, loginUserInfo).data
        assertEquals(6, result.size)
        assertEquals("20240110", result.last().dateXaxis)
        assertEquals("2", result.last().numYaxis)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/analysis_init.sql")
    fun getExpiredSubscribersLineChart() {
        val result = manageLineChartController.getExpiredSubscribersLineChart(req, loginUserInfo).data
        assertEquals(6, result.size)
        assertEquals("20240110", result.last().dateXaxis)
        assertEquals("2", result.last().numYaxis)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/analysis_init.sql")
    fun getNewSubscribersLineChart() {
        val result = manageLineChartController.getNewSubscribersLineChart(req, loginUserInfo).data
        assertEquals(6, result.size)
        assertEquals("20240110", result.last().dateXaxis)
        assertEquals("2", result.last().numYaxis)
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/analysis_init.sql")
    fun getTotalIncomeLineChart() {
        val result = manageLineChartController.getTotalIncomeLineChart(req, loginUserInfo).data
        assertEquals(6, result.size)
        assertEquals("20240110", result.last().dateXaxis)
        assertEquals("2", result.last().numYaxis)
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/analysis_init.sql")
    fun getDailyIncomeLineChart() {
        val result = manageLineChartController.getDailyIncomeLineChart(req, loginUserInfo).data
        assertEquals(6, result.size)
        assertEquals("20240110", result.last().dateXaxis)
        assertEquals("2", result.last().numYaxis)
    }


    @Test
    @Rollback
    @Transactional
    fun getCountrySubCountRanking() {
        init(LocalDate.now().minusDays(1))
        val result = manageLineChartController.getCountrySubCountRanking(PageVo(), LoginUserInfo()).data.list
        assertEquals("china", result.first().country)
        assertEquals(50, result.first().data)
    }


    @Test
    @Rollback
    @Transactional
    fun getCountryIncomeRanking() {
        init(LocalDate.now().minusDays(1))
        val result = manageLineChartController.getCountryIncomeRanking(PageVo(), LoginUserInfo()).data.list
        assertEquals("china", result.first().country)
        assertEquals(20384742, result.first().data)
    }
}