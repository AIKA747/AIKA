package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.StatisticsLineChartQueryVo
import com.parsec.aika.common.mapper.AnalysisMapper
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.Analysis
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import javax.annotation.Resource

@SpringBootTest
internal class ManageStatisticsControllerTest {

    @Resource
    private lateinit var controller: ManageStatisticsController

    private lateinit var user: LoginUserInfo

    private var ids: MutableList<Long>? = null

    @Resource
    private lateinit var analysisMapper: AnalysisMapper

    @BeforeEach
    fun setUp() {
        user = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        ids = mutableListOf()
        val dateFormat = DateTimeFormatter.ofPattern("yyyyMMdd")
        // 由于统计的会根据日期来，故不直接用sql插入数据（会导致之后的测试用例可能过不了）
        val analysis1 = Analysis().apply {
            this.totalUsers = (Math.random() * 100 +1).toInt()
            this.newUsers = (Math.random() * 10 +1).toInt()
            this.activeUsers = (Math.random() * 10 +1).toInt()
            this.inactiveUsers = (Math.random() * 10 +1).toInt()
            this.totalSubscribers = (Math.random() * 100 +1).toInt()
            this.newSubscribers = (Math.random() * 10 +1).toInt()
            this.expiredSubscribers = (Math.random() * 10 +1).toInt()
            this.totalExpiredSubscribers = (Math.random() * 10 +1).toInt()
            this.upcomingExpiringSubscribers = (Math.random() * 10 +1).toInt()
            this.income = (Math.random() * 10 +1).toInt()
            this.totalIncome = (Math.random() * 100 +1).toInt()
            this.dayId = LocalDate.now().minusDays(1).format(dateFormat)
            this.country = "aaa"
            this.createdAt = LocalDateTime.now()
        }
        analysisMapper.insert(analysis1)
        ids?.add(analysis1.id!!)
        val analysis2 = Analysis().apply {
            this.totalUsers = (Math.random() * 100 +1).toInt()
            this.newUsers = (Math.random() * 10 +1).toInt()
            this.activeUsers = (Math.random() * 10 +1).toInt()
            this.inactiveUsers = (Math.random() * 10 +1).toInt()
            this.totalSubscribers = (Math.random() * 100 +1).toInt()
            this.newSubscribers = (Math.random() * 10 +1).toInt()
            this.expiredSubscribers = (Math.random() * 10 +1).toInt()
            this.totalExpiredSubscribers = (Math.random() * 10 +1).toInt()
            this.upcomingExpiringSubscribers = (Math.random() * 10 +1).toInt()
            this.income = (Math.random() * 10 +1).toInt()
            this.totalIncome = (Math.random() * 100 +1).toInt()
            this.dayId = LocalDate.now().minusDays(1).format(dateFormat)
            this.country = "bbb"
            this.createdAt = LocalDateTime.now()
        }
        analysisMapper.insert(analysis2)
        ids?.add(analysis2.id!!)
        val analysis3 = Analysis().apply {
            this.totalUsers = (Math.random() * 100 +1).toInt()
            this.newUsers = (Math.random() * 10 +1).toInt()
            this.activeUsers = (Math.random() * 10 +1).toInt()
            this.inactiveUsers = (Math.random() * 10 +1).toInt()
            this.totalSubscribers = (Math.random() * 100 +1).toInt()
            this.newSubscribers = (Math.random() * 10 +1).toInt()
            this.expiredSubscribers = (Math.random() * 10 +1).toInt()
            this.totalExpiredSubscribers = (Math.random() * 10 +1).toInt()
            this.upcomingExpiringSubscribers = (Math.random() * 10 +1).toInt()
            this.income = (Math.random() * 10 +1).toInt()
            this.totalIncome = (Math.random() * 100 +1).toInt()
            this.dayId = LocalDate.now().minusDays(1).format(dateFormat)
            this.country = "ccc"
            this.createdAt = LocalDateTime.now()
        }
        analysisMapper.insert(analysis3)
        ids?.add(analysis3.id!!)
        val analysis4 = Analysis().apply {
            this.totalUsers = (Math.random() * 100 +1).toInt()
            this.newUsers = (Math.random() * 10 +1).toInt()
            this.activeUsers = (Math.random() * 10 +1).toInt()
            this.inactiveUsers = (Math.random() * 10 +1).toInt()
            this.totalSubscribers = (Math.random() * 100 +1).toInt()
            this.newSubscribers = (Math.random() * 10 +1).toInt()
            this.expiredSubscribers = (Math.random() * 10 +1).toInt()
            this.totalExpiredSubscribers = (Math.random() * 10 +1).toInt()
            this.upcomingExpiringSubscribers = (Math.random() * 10 +1).toInt()
            this.income = (Math.random() * 10 +1).toInt()
            this.totalIncome = (Math.random() * 100 +1).toInt()
            this.dayId = LocalDate.now().minusDays(2).format(dateFormat)
            this.country = "aaa"
            this.createdAt = LocalDateTime.now().minusDays(1)
        }
        analysisMapper.insert(analysis4)
        ids?.add(analysis4.id!!)
        val analysis5 = Analysis().apply {
            this.totalUsers = (Math.random() * 100 +1).toInt()
            this.newUsers = (Math.random() * 10 +1).toInt()
            this.activeUsers = (Math.random() * 10 +1).toInt()
            this.inactiveUsers = (Math.random() * 10 +1).toInt()
            this.totalSubscribers = (Math.random() * 100 +1).toInt()
            this.newSubscribers = (Math.random() * 10 +1).toInt()
            this.expiredSubscribers = (Math.random() * 10 +1).toInt()
            this.totalExpiredSubscribers = (Math.random() * 10 +1).toInt()
            this.upcomingExpiringSubscribers = (Math.random() * 10 +1).toInt()
            this.income = (Math.random() * 10 +1).toInt()
            this.totalIncome = (Math.random() * 100 +1).toInt()
            this.dayId = LocalDate.now().minusDays(2).format(dateFormat)
            this.country = "bbb"
            this.createdAt = LocalDateTime.now().minusDays(1)
        }
        analysisMapper.insert(analysis5)
        ids?.add(analysis5.id!!)
    }

    @AfterEach
    fun setAfter() {
        ids!!.map {
            analysisMapper.deleteById(it)
        }
    }

    @Test
    @Rollback
    @Transactional
    fun getTotalUsers() {
        val result = controller.getTotalUsers(user)
        assertEquals(result.code, 0)
    }

    @Test
    fun getActiveUsersInfo() {
        val result = controller.getActiveUsersInfo(user)
        assertEquals(result.code, 0)
    }

    @Test
    fun getInactiveUsers() {
        val result = controller.getInactiveUsers(user)
        assertEquals(result.code, 0)
    }

    @Test
    fun getNewUserStats() {
        val result = controller.getNewUserStats(user)
        assertEquals(result.code, 0)
    }

    @Test
    fun getTotalUsersLineChart() {
        val result = controller.getTotalUsersLineChart(StatisticsLineChartQueryVo(), user)
        assertEquals(result.code, 0)
    }

    @Test
    fun getInactiveUsersLineChart() {
        val result = controller.getInactiveUsersLineChart(StatisticsLineChartQueryVo(), user)
        assertEquals(result.code, 0)
    }

    @Test
    fun getActiveUserLineChart() {
        val result = controller.getActiveUserLineChart(StatisticsLineChartQueryVo(), user)
        assertEquals(result.code, 0)
    }

    @Test
    fun getNewUsersLineChart() {
        val result = controller.getNewUsersLineChart(StatisticsLineChartQueryVo(), user)
        assertEquals(result.code, 0)
    }

    @Test
    fun getUserCountRanking() {
        val result = controller.getUserCountRanking(PageVo(), user)
        assertEquals(result.code, 0)
        assertNotEquals(result.data.total, 0)
    }
}