package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.req.StatisticsLineChartQueryVo
import com.parsec.aika.admin.model.vo.resp.*
import com.parsec.aika.admin.service.StatisticsService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageStatisticsController {

    @Resource
    private lateinit var statisticsService: StatisticsService

    /**
     * 获取总用户统计信息
     */
    @GetMapping("/analytics/today/total-users")
    fun getTotalUsers(user: LoginUserInfo): BaseResult<StatisticsTotalUsersResp> {
        return BaseResult.success(statisticsService.analyticsTotalUsers())
    }

    /**
     * 活跃用户统计
     */
    @GetMapping("/analytics/today/active-users")
    fun getActiveUsersInfo(user: LoginUserInfo): BaseResult<StatisticsActiveUsersResp> {
        return BaseResult.success(statisticsService.analyticsActiveUsers())
    }

    /**
     * 不活跃用户统计
     */
    @GetMapping("/analytics/today/inactive-users")
    fun getInactiveUsers(user: LoginUserInfo): BaseResult<StatisticsInactiveUsersResp> {
        return BaseResult.success(statisticsService.analyticsInactiveUsers())
    }

    /**
     * 新用户统计
     */
    @GetMapping("/analytics/today/new-users")
    fun getNewUserStats(user: LoginUserInfo): BaseResult<StatisticsNewUsersResp> {
        return BaseResult.success(statisticsService.analyticsNewUsers())
    }

    /**
     * 总用户数折线图
     */
    @GetMapping("/total-users/line-chart")
    fun getTotalUsersLineChart(queryVo: StatisticsLineChartQueryVo, user: LoginUserInfo): BaseResult<List<StatisticsLineChartVo>> {
        return BaseResult.success(statisticsService.totalUsersLineChart(queryVo))
    }

    /**
     * 不活跃用户数折线图
     */
    @GetMapping("/inactive-users/line-chart")
    fun getInactiveUsersLineChart(queryVo: StatisticsLineChartQueryVo, user: LoginUserInfo): BaseResult<List<StatisticsLineChartVo>> {
        return BaseResult.success(statisticsService.inactiveUsersLineChart(queryVo))
    }

    /**
     * 活跃用户数折线图
     */
    @GetMapping("/active-users/line-chart")
    fun getActiveUserLineChart(queryVo: StatisticsLineChartQueryVo, user: LoginUserInfo): BaseResult<List<StatisticsLineChartVo>> {
        return BaseResult.success(statisticsService.activeUsersLineChart(queryVo))
    }

    /**
     * 新增用户数折线图
     */
    @GetMapping("/new-users/line-chart")
    fun getNewUsersLineChart(queryVo: StatisticsLineChartQueryVo, user: LoginUserInfo): BaseResult<List<StatisticsLineChartVo>> {
        return BaseResult.success(statisticsService.newUsersLineChart(queryVo))
    }

    /**
     * 用户数量统计排名
     * (查询昨天统计的城市、总用户数)
     */
    @GetMapping("/country/user-count-ranking")
    fun getUserCountRanking(pageVo: PageVo, user: LoginUserInfo): BaseResult<PageResult<StatisticsUserCountRankingVo>> {
        return BaseResult.success(statisticsService.userCountRanking(pageVo))
    }



}