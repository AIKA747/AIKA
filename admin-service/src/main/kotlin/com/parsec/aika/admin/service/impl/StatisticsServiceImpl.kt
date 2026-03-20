package com.parsec.aika.admin.service.impl

import com.github.pagehelper.PageHelper
import com.parsec.aika.admin.model.vo.req.StatisticsLineChartQueryVo
import com.parsec.aika.admin.model.vo.resp.*
import com.parsec.aika.admin.service.StatisticsService
import com.parsec.aika.common.mapper.AnalysisMapper
import com.parsec.aika.common.model.entity.Analysis
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.annotation.Resource

@Service
class StatisticsServiceImpl : StatisticsService {

    @Resource
    private lateinit var analysisMapper: AnalysisMapper

    private val dateFormat = DateTimeFormatter.ofPattern("yyyyMMdd")

    // 默认同比数（当数据为空时，返回该默认数据）
    private val defaultChange = "Processing"

    override fun analyticsTotalUsers(): StatisticsTotalUsersResp {
        // 查询昨天的用户统计数据
        val analysisYesterday = this.someDayAnalysisData(1)
        // 查询得到前天的用户统计数据
        val analysisDayBeforeYesterday = this.someDayAnalysisData(2)
        // 查询前面七天前那天的数据（若今天是第15日，则得到8日的数据）
        val analysisEightDay = this.someDayAnalysisData(7)
        val resp = StatisticsTotalUsersResp().apply {
            this.totalUsers = if (analysisYesterday?.totalUsers == null) 0 else analysisYesterday.totalUsers
            this.totalSubscribers =
                if (analysisYesterday?.totalSubscribers == null) 0 else analysisYesterday.totalSubscribers
        }
        // 计算同比
        // 日同比：昨天的数据/前天的数据
        resp.dodChange = if (analysisDayBeforeYesterday?.dayId == null) defaultChange else this.percentage(
            analysisYesterday?.totalUsers, analysisDayBeforeYesterday.totalUsers
        )
        // 周同比：如今天是第15日，14日/8日，即昨天/8日
        resp.wowChange = if (analysisEightDay?.dayId.isNullOrBlank()) defaultChange else this.percentage(
            analysisYesterday?.totalUsers, analysisEightDay?.totalUsers
        )
        return resp
    }

    override fun analyticsActiveUsers(): StatisticsActiveUsersResp {
        // 查询昨天的用户统计数据
        val analysisYesterday = this.someDayAnalysisData(1)
        // 查询得到前天的用户统计数据
        val analysisDayBeforeYesterday = this.someDayAnalysisData(2)
        val resp = StatisticsActiveUsersResp().apply {
            this.activeUsers = if (analysisYesterday?.activeUsers == null) 0 else analysisYesterday.activeUsers
        }
        // 平均每天活跃用户数（汇总活跃用户数/总天数）
        // 得到总的汇总数据
        val allAnalyticsList = analysisMapper.allAnalysisSum()
        // 得到总的统计天数
        val allDays = analysisMapper.allAnalysisDayCount()
        resp.dailyActiveUsers = this.doubleDivide(allAnalyticsList?.activeUsers, allDays)
        // 计算同比
        // 日同比：昨天的数据/前天的数据
        resp.dodChange = if (analysisDayBeforeYesterday?.dayId == null) defaultChange else this.percentage(
            analysisYesterday?.activeUsers!!, analysisDayBeforeYesterday.activeUsers!!
        )
        // 周同比：今天15日，8-14日总数/1-7日总数，若没有那么多天数据，则默认为100%——————默认为Processing
        // 查询第一日的数据，若没有默认周同比为100%——————默认为Processing
        val analysisOneDay = this.someDayAnalysisData(14)
        resp.wowChange = if (analysisOneDay?.dayId.isNullOrBlank()) {
            defaultChange
        } else {
            // 查询8-14日的总数
            val analyticsListLast = analysisMapper.someDaysAnalysis(
                LocalDate.now().minusDays(7).format(dateFormat), LocalDate.now().minusDays(1).format(dateFormat)
            )
            // 查询1-7日的总数
            val analyticsListFirst = analysisMapper.someDaysAnalysis(
                LocalDate.now().minusDays(14).format(dateFormat), LocalDate.now().minusDays(8).format(dateFormat)
            )
            this.percentage(analyticsListLast?.activeUsers!!, analyticsListFirst?.activeUsers!!)
        }
        return resp
    }

    override fun analyticsInactiveUsers(): StatisticsInactiveUsersResp {
        // 查询昨天的用户统计数据
        val analysisYesterday = this.someDayAnalysisData(1)
        // 查询得到前天的用户统计数据
        val analysisDayBeforeYesterday = this.someDayAnalysisData(2)
        val resp = StatisticsInactiveUsersResp().apply {
            this.inactiveUsers = if (analysisYesterday?.inactiveUsers == null) 0 else analysisYesterday.inactiveUsers
        }
        // 平均每天不活跃用户数（汇总不活跃用户数/总天数）
        // 得到总的汇总数据
        val allAnalyticsList = analysisMapper.allAnalysisSum()
        // 得到总的统计天数
        val allDays = analysisMapper.allAnalysisDayCount()
        resp.dailyInactiveUsers = this.doubleDivide(allAnalyticsList?.inactiveUsers, allDays)
        // 计算同比
        // 日同比：昨天的数据/前天的数据
        resp.dodChange = if (analysisDayBeforeYesterday?.dayId == null) defaultChange else this.percentage(
            analysisYesterday?.inactiveUsers, analysisDayBeforeYesterday.inactiveUsers
        )
        // 周同比：今天15日，8-14日总数/1-7日总数，若没有那么多天数据，则默认为100%——————默认为Processing
        // 查询第一日的数据，若没有默认周同比为100%——————默认为Processing
        val analysisOneDay = this.someDayAnalysisData(14)
        resp.wowChange = if (analysisOneDay?.dayId.isNullOrBlank()) {
            defaultChange
        } else {
            // 查询8-14日的总数
            val analyticsListLast = analysisMapper.someDaysAnalysis(
                LocalDate.now().minusDays(7).format(dateFormat), LocalDate.now().minusDays(1).format(dateFormat)
            )
            // 查询1-7日的总数
            val analyticsListFirst = analysisMapper.someDaysAnalysis(
                LocalDate.now().minusDays(14).format(dateFormat), LocalDate.now().minusDays(8).format(dateFormat)
            )
            this.percentage(analyticsListLast?.inactiveUsers, analyticsListFirst?.inactiveUsers)
        }
        return resp
    }

    override fun analyticsNewUsers(): StatisticsNewUsersResp {
        // 查询昨天的用户统计数据
        val analysisYesterday = this.someDayAnalysisData(1)
        // 查询得到前天的用户统计数据
        val analysisDayBeforeYesterday = this.someDayAnalysisData(2)
        val resp = StatisticsNewUsersResp().apply {
            this.newUsers = if (analysisYesterday?.newUsers == null) 0 else analysisYesterday.newUsers
        }
        // 平均每天不活跃用户数（汇总不活跃用户数/总天数）
        // 得到总的汇总数据
        val allAnalyticsList = analysisMapper.allAnalysisSum()
        // 得到总的统计天数
        val allDays = analysisMapper.allAnalysisDayCount()
        resp.dailyNewUsers = this.doubleDivide(allAnalyticsList?.newUsers, allDays)
        // 计算同比
        // 日同比：昨天的数据/前天的数据
        resp.dodChange = if (analysisDayBeforeYesterday?.dayId == null) defaultChange else this.percentage(
            analysisYesterday?.newUsers, analysisDayBeforeYesterday.newUsers
        )
        // 周同比：今天15日，8-14日总数/1-7日总数，若没有那么多天数据，则默认为100%——————默认为Processing
        // 查询第一日的数据，若没有默认周同比为100%——————默认为Processing
        val analysisOneDay = this.someDayAnalysisData(14)
        resp.wowChange = if (analysisOneDay?.dayId.isNullOrBlank()) {
            defaultChange
        } else {
            // 查询8-14日的总数
            val analyticsListLast = analysisMapper.someDaysAnalysis(
                LocalDate.now().minusDays(7).format(dateFormat), LocalDate.now().minusDays(1).format(dateFormat)
            )
            // 查询1-7日的总数
            val analyticsListFirst = analysisMapper.someDaysAnalysis(
                LocalDate.now().minusDays(14).format(dateFormat), LocalDate.now().minusDays(8).format(dateFormat)
            )
            this.percentage(analyticsListLast?.newUsers, analyticsListFirst?.newUsers)
        }
        return resp
    }

    override fun totalUsersLineChart(queryVo: StatisticsLineChartQueryVo): List<StatisticsLineChartVo> {
        // 若未传入查询条件，则默认查询最近三十天的数据
        val req = this.checkQueryDate(queryVo)
        val analyticsList = analysisMapper.someDaysDayAnalysis(req)
        val list = mutableListOf<StatisticsLineChartVo>()
        analyticsList.map {
            list.add(StatisticsLineChartVo().apply {
                this.dateXaxis = it.dayId
                // 总用户
                this.numYaxis = it.totalUsers.toString()
            })
        }
        return list
    }

    override fun inactiveUsersLineChart(queryVo: StatisticsLineChartQueryVo): List<StatisticsLineChartVo> {
        // 若未传入查询条件，则默认查询最近三十天的数据
        val req = this.checkQueryDate(queryVo)
        val analyticsList = analysisMapper.someDaysDayAnalysis(req)
        val list = mutableListOf<StatisticsLineChartVo>()
        analyticsList.map {
            list.add(StatisticsLineChartVo().apply {
                this.dateXaxis = it.dayId
                // 不活跃用户
                this.numYaxis = it.inactiveUsers.toString()
            })
        }
        return list
    }

    override fun activeUsersLineChart(queryVo: StatisticsLineChartQueryVo): List<StatisticsLineChartVo> {
        // 若未传入查询条件，则默认查询最近三十天的数据
        val req = this.checkQueryDate(queryVo)
        val analyticsList = analysisMapper.someDaysDayAnalysis(req)
        val list = mutableListOf<StatisticsLineChartVo>()
        analyticsList.map {
            list.add(StatisticsLineChartVo().apply {
                this.dateXaxis = it.dayId
                // 活跃用户
                this.numYaxis = it.activeUsers.toString()
            })
        }
        return list
    }

    override fun newUsersLineChart(queryVo: StatisticsLineChartQueryVo): List<StatisticsLineChartVo> {
        // 若未传入查询条件，则默认查询最近三十天的数据
        val req = this.checkQueryDate(queryVo)
        val analyticsList = analysisMapper.someDaysDayAnalysis(req)
        val list = mutableListOf<StatisticsLineChartVo>()
        analyticsList.map {
            list.add(StatisticsLineChartVo().apply {
                this.dateXaxis = it.dayId
                // 新增用户
                this.numYaxis = it.newUsers.toString()
            })
        }
        return list
    }

    override fun userCountRanking(pageVo: PageVo): PageResult<StatisticsUserCountRankingVo> {
        PageHelper.startPage<StatisticsUserCountRankingVo>(pageVo.pageNo!!, pageVo.pageSize!!)
        return PageUtil<StatisticsUserCountRankingVo>().page(analysisMapper.selectAnalysisByCountry())
    }

    /**
     * 查询某天的统计数据
     * 入参：今天之前面几天。如昨天，就是1，前天就是2
     */
    private fun someDayAnalysisData(days: Long): Analysis? {
        return analysisMapper.someDayAnalysis(LocalDate.now().minusDays(days).format(dateFormat))
    }

    /**
     * double相除
     */
    private fun doubleDivide(num1: Int?, num2: Int?): Double {
        if (num2 == 0 && num1!! > 0) return 1.00
        if (num2 == 0 && num1!! < 0) return -1.00
        val bigDecimal1 = BigDecimal(num1.toString())
        val bigDecimal2 = BigDecimal(num2.toString())
        if (bigDecimal2.compareTo(BigDecimal.ZERO) == 0) return 0.0
        return bigDecimal1.divide(bigDecimal2, 10, BigDecimal.ROUND_HALF_UP).toDouble()
    }

    /**
     * 同比百分比展示字符串百分数
     */
    private fun percentage(num1: Int?, num2: Int?): String {
        if (num1 == num2) return "0.00%"
        val percentageDouble = this.doubleDivide(num1!! - num2!!, num2)
//        if (percentageDouble == 0.0) return defaultChange
        val percentageBigDecimal = BigDecimal(percentageDouble.toString())
        val result = percentageBigDecimal.multiply(BigDecimal(100)).setScale(2, RoundingMode.HALF_UP)
        return "$result%"
    }

    /**
     * 检测传入的日期查询参数，若未传或未传完，则默认返回最近三十天的时间供查询
     */
    private fun checkQueryDate(queryVo: StatisticsLineChartQueryVo): StatisticsLineChartQueryVo {
        if (queryVo.startDate.isNullOrBlank() || queryVo.endDate.isNullOrBlank()) {
            queryVo.endDate = LocalDate.now().minusDays(1).format(dateFormat)
            queryVo.startDate = LocalDate.now().minusDays(30).format(dateFormat)
        }
        return queryVo
    }

}