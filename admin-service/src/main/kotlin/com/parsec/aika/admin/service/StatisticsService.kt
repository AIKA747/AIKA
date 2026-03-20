package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.req.StatisticsLineChartQueryVo
import com.parsec.aika.admin.model.vo.resp.*
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.PageResult

interface StatisticsService {

    /**
     * 获取总用户统计信息
     */
    fun analyticsTotalUsers(): StatisticsTotalUsersResp

    /**
     * 获取活跃用户统计信息
     */
    fun analyticsActiveUsers(): StatisticsActiveUsersResp

    /**
     * 获取不活跃用户统计信息
     */
    fun analyticsInactiveUsers(): StatisticsInactiveUsersResp

    /**
     * 获取新用户统计信息
     */
    fun analyticsNewUsers(): StatisticsNewUsersResp

    /**
     * 总用户折线图
     */
    fun totalUsersLineChart(queryVo: StatisticsLineChartQueryVo): List<StatisticsLineChartVo>

    /**
     * 不活跃用户折线图
     */
    fun inactiveUsersLineChart(queryVo: StatisticsLineChartQueryVo): List<StatisticsLineChartVo>

    /**
     * 活跃用户折线图
     */
    fun activeUsersLineChart(queryVo: StatisticsLineChartQueryVo): List<StatisticsLineChartVo>

    /**
     * 新增用户折线图
     */
    fun newUsersLineChart(queryVo: StatisticsLineChartQueryVo): List<StatisticsLineChartVo>

    /**
     * 用户数量统计排名
     */
    fun userCountRanking(pageVo: PageVo): PageResult<StatisticsUserCountRankingVo>

}