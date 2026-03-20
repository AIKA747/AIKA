package com.parsec.aika.admin.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.admin.model.vo.resp.*
import com.parsec.aika.admin.remote.OrderFeignClient
import com.parsec.aika.admin.remote.UserFeignClient
import com.parsec.aika.admin.service.AnalysisService
import com.parsec.aika.common.mapper.AnalysisMapper
import com.parsec.aika.common.model.entity.Analysis
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.stream.Collectors
import javax.annotation.Resource

@Service
class AnalysisServiceImpl : AnalysisService {

    @Resource
    private lateinit var analysisMapper: AnalysisMapper

    @Resource
    private lateinit var orderFeignClient: OrderFeignClient

    @Resource
    private lateinit var userFeignClient: UserFeignClient

    private final val DATE_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMdd")

    override fun saveUserAnalysis(date: String) {
        val countryList = userFeignClient.getUserCountryList()
        countryList.data.map {
            val analysisVo = Analysis()
            analysisVo.dayId = date
            analysisVo.country = it
            val subDataResp = orderFeignClient.getFeignSubscribersData(date, it).data
            analysisVo.newSubscribers = subDataResp.newSubscribers
            analysisVo.expiredSubscribers = subDataResp.expiredSubscribers
            analysisVo.totalSubscribers = subDataResp.totalSubscribers
            analysisVo.upcomingExpiringSubscribers = subDataResp.upcomingExpiringSubscribers
            analysisVo.totalExpiredSubscribers = subDataResp.totalExpiredSubscribers
            val userNumData = userFeignClient.getUserNums(date, it).data
            analysisVo.totalUsers = userNumData.totalUsers
            analysisVo.newUsers = userNumData.newUsers
            analysisVo.activeUsers = userNumData.activeUsers
            analysisVo.inactiveUsers = userNumData.inactiveUsers
            val incomeDataResp = orderFeignClient.getFeignIncomeData(date, it).data
            analysisVo.income = incomeDataResp.income
            analysisVo.totalIncome = incomeDataResp.totalIncome
            analysisVo.createdAt = LocalDateTime.now()
            analysisMapper.insert(analysisVo)
        }
    }

    /**
     * 订阅者数量统计
     */
    override fun getAnalyticsSubscribersNum(): GetAdminAnalyticsSubscribersNumResp {
        val TODAY = LocalDate.now().minusDays(1)
        val preWeek = TODAY.minusWeeks((1).toLong())
        // 上周当日～当日
        val currentData = analysisMapper.selectList(
            KtQueryWrapper(Analysis::class.java).between(
                Analysis::dayId,
                preWeek.format(DATE_FORMAT),
                TODAY.format(DATE_FORMAT)
            )
        )
        val currentDataMap = currentData.groupBy { it.dayId }
        // 今日
        val todayData = currentDataMap[TODAY.format(DATE_FORMAT)]?.sumOf { it.totalSubscribers ?: 0 } ?: 0
        // 昨日
        val yesterdayData =
            currentDataMap[TODAY.minusDays(1).format(DATE_FORMAT)]?.sumOf { it.totalSubscribers ?: 0 } ?: 0
        // 上周今日
        val preWeekData =
            currentDataMap[TODAY.minusWeeks(1).format(DATE_FORMAT)]?.sumOf { it.totalSubscribers ?: 0 } ?: 0

        return GetAdminAnalyticsSubscribersNumResp().apply {
            this.totalSubscribers = currentDataMap[TODAY.format(DATE_FORMAT)]?.sumOf { it.totalSubscribers ?: 0 } ?: 0
            this.totalUsers = currentDataMap[TODAY.format(DATE_FORMAT)]?.sumOf { it.totalUsers ?: 0 } ?: 0
            this.totalExpiredSubscribers =
                currentDataMap[TODAY.format(DATE_FORMAT)]?.sumOf { it.totalExpiredSubscribers ?: 0 } ?: 0
            this.upcomingExpiringSubscribers =
                currentDataMap[TODAY.format(DATE_FORMAT)]?.sumOf { it.upcomingExpiringSubscribers ?: 0 } ?: 0
            this.totalDodChange = dataChange(todayData.toDouble(), yesterdayData.toDouble())
            this.totalWowChange = dataChange(todayData.toDouble(), preWeekData.toDouble())
        }
    }

    /**
     * 月订阅
     */
    override fun getAnalyticsNewSubscribersMonth(): GetAdminAnalyticsNewSubscribersMonthResp {
        val TODAY = LocalDate.now().minusDays(1)
        // 历史所有数据，按每月分组
        val data = analysisMapper.monthlyNewSubscribers().associateBy { it.date }
        // 本月数据
        val currentData = data[convertDateParam(TODAY)]?.num ?: 0
        // 上月
        val preData = data[convertDateParam(TODAY.minusMonths(1))]?.num ?: 0
        return GetAdminAnalyticsNewSubscribersMonthResp().apply {
            this.newSubscribers = currentData
            this.momChange = dataChange(currentData.toDouble(), preData.toDouble())
            this.monthlyNewSubscribers = if (data.isEmpty()) 0 else data.values.sumOf { it.num ?: 0 } / data.values.size
        }
    }

    /**
     * 周订阅
     */
    override fun getAnalyticsNewSubscribersWeek(): GetAdminAnalyticsNewSubscribersWeekResp {
        val TODAY = LocalDate.now().minusDays(1)
        val monday = TODAY.minusDays((TODAY.dayOfWeek.value - 1).toLong())
        // 周一～当日
        val currentData = analysisMapper.selectList(
            KtQueryWrapper(Analysis::class.java).between(
                Analysis::dayId,
                monday.format(DATE_FORMAT),
                TODAY.format(DATE_FORMAT)
            )
        )
        val currentDataMap = currentData.groupBy { it.dayId }
        // 上周一～上周日
        val preData = analysisMapper.selectList(
            KtQueryWrapper(Analysis::class.java).between(
                Analysis::dayId,
                monday.minusWeeks(1).format(DATE_FORMAT),
                monday.minusDays(1).format(DATE_FORMAT)
            )
        )
        // 今日
        val todayData = currentDataMap[TODAY.format(DATE_FORMAT)]?.sumOf { it.newSubscribers ?: 0 } ?: 0
        // 昨日
        val yesterdayData =
            currentDataMap[TODAY.minusDays(1).format(DATE_FORMAT)]?.sumOf { it.newSubscribers ?: 0 } ?: 0

        return GetAdminAnalyticsNewSubscribersWeekResp().apply {
            this.newSubscribers = currentData.sumOf { it.newSubscribers ?: 0 }
            this.wowChange =
                dataChange(this.newSubscribers!!.toDouble(), preData.sumOf { it.newSubscribers ?: 0 }.toDouble())
            this.dailyNewSubscribers = todayData
            this.dodChange = dataChange(todayData.toDouble(), yesterdayData.toDouble())
        }
    }

    /**
     * 年收入统计
     */
    override fun getAnalyticsIncomeYear(): GetAdminAnalyticsIncomeYearResp {
        val TODAY = LocalDate.now().minusDays(1)
        // 历史所有数据，按每年分组
        val data = analysisMapper.annualIncome().associateBy { it.date }
        // 本年数据
        val currentData = data[TODAY.year.toString()]?.num ?: 0
        // 去年数据
        val preData = data[TODAY.minusYears(1).year.toString()]?.num ?: 0
        return GetAdminAnalyticsIncomeYearResp().apply {
            this.income = currentData
            this.yoyChange = dataChange(currentData.toDouble(), preData.toDouble())
            this.annualIncome = if (data.isEmpty()) 0 else data.values.sumOf { it.num ?: 0 } / data.values.size

        }
    }

    /**
     * 月收入统计
     */
    override fun getAnalyticsIncomeMonth(): GetAdminAnalyticsIncomeMonthResp {
        val TODAY = LocalDate.now().minusDays(1)
        // 历史所有数据，按每月分组
        val data = analysisMapper.monthlyIncome().associateBy { it.date }
        // 本月数据
        val currentData = data[convertDateParam(TODAY)]?.num ?: 0
        // 去年同月数据
        val preData = data[convertDateParam(TODAY.minusMonths(1))]?.num ?: 0
        return GetAdminAnalyticsIncomeMonthResp().apply {
            this.income = currentData
            this.momChange = dataChange(currentData.toDouble(), preData.toDouble())
            this.monthlyIncome = if (data.isEmpty()) 0 else data.values.sumOf { it.num ?: 0 } / data.values.size
        }
    }

    /**
     * 周统计
     */
    override fun getAnalyticsIncomeWeek(): GetAdminAnalyticsIncomeWeekResp {
        val TODAY = LocalDate.now().minusDays(1)
        val monday = TODAY.minusDays((TODAY.dayOfWeek.value - 1).toLong())
        // 周一～当日
        val currentData = analysisMapper.selectList(
            KtQueryWrapper(Analysis::class.java).between(
                Analysis::dayId,
                monday.format(DATE_FORMAT),
                TODAY.format(DATE_FORMAT)
            )
        )
        val currentDataMap = currentData.groupBy { it.dayId }
        // 上周一～上周日
        val preData = analysisMapper.selectList(
            KtQueryWrapper(Analysis::class.java).between(
                Analysis::dayId,
                monday.minusWeeks(1).format(DATE_FORMAT),
                monday.minusDays(1).format(DATE_FORMAT)
            )
        )
        // 今日
        val todayData = currentDataMap[TODAY.format(DATE_FORMAT)]?.sumOf { it.income ?: 0 } ?: 0
        // 查询日平均收入
        val dayNum = currentData.stream().collect(Collectors.groupingBy(Analysis::dayId)).size
        return GetAdminAnalyticsIncomeWeekResp().apply {
            this.income = currentData.sumOf { it.income ?: 0 }
            this.wowChange = dataChange(this.income!!.toDouble(), preData.sumOf { it.income ?: 0 }.toDouble())
            this.dailyIncome = if (currentData.isEmpty()) 0 else currentData.sumOf { it.income ?: 0 } / dayNum
        }
    }

    /**
     * 将日期转换为方便查询记录的参数格式
     * 2024-01-01 to 202401
     */
    private fun convertDateParam(date: LocalDate): String {
        val month = if (date.monthValue < 10) "0${date.monthValue}" else date.monthValue
        return "${date.year}${month}"
    }

    /**
     * 同步增长计算
     */
    private fun dataChange(current: Double, pre: Double): String {
        if (pre == current) return "0.00%"
        if (pre == 0.0 && current > 0) return "100%"
        if (pre == 0.0 && current < 0) return "-100%"
        val currentDecimal = BigDecimal(current.toString())
        val preDecimal = BigDecimal(pre.toString())
        val subtract = currentDecimal.subtract(preDecimal)
        val divide = subtract.divide(preDecimal, RoundingMode.HALF_UP)
        val result = divide.multiply(BigDecimal(100))
            .setScale(2, RoundingMode.HALF_UP)
        return "$result%"
    }


}