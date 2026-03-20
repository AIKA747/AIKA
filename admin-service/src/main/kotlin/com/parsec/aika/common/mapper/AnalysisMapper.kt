package com.parsec.aika.common.mapper

import com.baomidou.mybatisplus.core.mapper.BaseMapper
import com.parsec.aika.admin.model.vo.req.LineChartReq
import com.parsec.aika.admin.model.vo.resp.AnalyticsDataResp
import com.parsec.aika.admin.model.vo.req.StatisticsLineChartQueryVo
import com.parsec.aika.admin.model.vo.resp.LineChartResp
import com.parsec.aika.admin.model.vo.resp.RankingResp
import com.parsec.aika.admin.model.vo.resp.StatisticsUserCountRankingVo
import com.parsec.aika.common.model.entity.Analysis
import com.parsec.aika.common.model.vo.LoginUserInfo
import org.apache.ibatis.annotations.Mapper
import org.apache.ibatis.annotations.Param
import org.apache.ibatis.annotations.Select

@Mapper
interface AnalysisMapper: BaseMapper<Analysis> {
    @Select("""
        SELECT substr(a.dayId,1, 6) as `date`, sum(ifnull(a.newSubscribers, 0)) as num
        FROM analysis as a
        group by `date`
    """)
    fun monthlyNewSubscribers(): List<AnalyticsDataResp>

    @Select("""
        SELECT substr(a.dayId,1, 4) as `date`, sum(ifnull(a.income, 0)) as num
        FROM analysis as a
        group by `date`
    """)
    fun annualIncome(): List<AnalyticsDataResp>

    @Select("""
        SELECT substr(a.dayId,1, 6) as `date`, sum(ifnull(a.income, 0)) as num
        FROM analysis as a
        group by `date`
    """)
    fun monthlyIncome(): List<AnalyticsDataResp>

    /**
     * 查询某天的统计数据汇总
     */
    @Select("""
        <script>
            select 
                temp.dayId, sum(IFNULL(temp.newSubscribers, 0)) as newSubscribers, 
                sum(IFNULL(temp.expiredSubscribers, 0)) as expiredSubscribers, 
                sum(IFNULL(temp.totalSubscribers, 0)) as totalSubscribers, 
                sum(IFNULL(temp.upcomingExpiringSubscribers, 0)) as upcomingExpiringSubscribers, 
                sum(IFNULL(temp.totalExpiredSubscribers, 0)) as totalExpiredSubscribers, 
                sum(IFNULL(temp.totalUsers, 0)) as totalUsers, sum(IFNULL(temp.newUsers, 0)) as newUsers, 
                sum(IFNULL(temp.activeUsers, 0)) as activeUsers, 
                sum(IFNULL(temp.inactiveUsers, 0)) as inactiveUsers, 
                sum(IFNULL(temp.income, 0)) as income, sum(IFNULL(temp.totalIncome, 0)) as totalIncome
            from (
                select * from analysis where dayId = #{date}
            ) as temp
        </script>
    """)
    fun someDayAnalysis(@Param("date") date: String): Analysis?

    /**
     * 查询某段时间的统计数据汇总
     */
    @Select("""
        <script>
            select 
                sum(IFNULL(temp.newSubscribers, 0)) as newSubscribers, 
                sum(IFNULL(temp.expiredSubscribers, 0)) as expiredSubscribers, 
                sum(IFNULL(temp.totalSubscribers, 0)) as totalSubscribers, 
                sum(IFNULL(temp.upcomingExpiringSubscribers, 0)) as upcomingExpiringSubscribers, 
                sum(IFNULL(temp.totalExpiredSubscribers, 0)) as totalExpiredSubscribers, 
                sum(IFNULL(temp.totalUsers, 0)) as totalUsers, sum(IFNULL(temp.newUsers, 0)) as newUsers, 
                sum(IFNULL(temp.activeUsers, 0)) as activeUsers, 
                sum(IFNULL(temp.inactiveUsers, 0)) as inactiveUsers, 
                sum(IFNULL(temp.income, 0)) as income, sum(IFNULL(temp.totalIncome, 0)) as totalIncome
            from (
                select * from analysis where #{dateEnd} >= dayId and dayId >= #{dateStart}
            ) as temp
        </script>
    """)
    fun someDaysAnalysis(@Param("dateStart") dateStart: String, @Param("dateEnd") dateEnd: String): Analysis?

    /**
     * 得到统计表中的总数据
     */
    @Select("""
        <script>
            select 
                sum(IFNULL(newSubscribers, 0)) as newSubscribers, 
                sum(IFNULL(expiredSubscribers, 0)) as expiredSubscribers, 
                sum(IFNULL(totalSubscribers, 0)) as totalSubscribers, 
                sum(IFNULL(upcomingExpiringSubscribers, 0)) as upcomingExpiringSubscribers, 
                sum(IFNULL(totalExpiredSubscribers, 0)) as totalExpiredSubscribers, 
                sum(IFNULL(totalUsers, 0)) as totalUsers, sum(IFNULL(newUsers, 0)) as newUsers, 
                sum(IFNULL(activeUsers, 0)) as activeUsers, 
                sum(IFNULL(inactiveUsers, 0)) as inactiveUsers, 
                sum(IFNULL(income, 0)) as income, sum(IFNULL(totalIncome, 0)) as totalIncome
            from analysis 
        </script>
    """)
    fun allAnalysisSum(): Analysis?

    /**
     * 得到总统计天数
     */
    @Select("""
        <script>
            select IFNULL(count(*), 0) from (select count(*) from analysis group by dayId) as temp
        </script>
    """)
    fun allAnalysisDayCount(): Int


    /**
     * 查询某段时间每天的统计数据汇总
     */
    @Select("""
        <script>
            select 
                temp.dayId as dayId,
                sum(IFNULL(temp.newSubscribers, 0)) as newSubscribers, 
                sum(IFNULL(temp.expiredSubscribers, 0)) as expiredSubscribers, 
                sum(IFNULL(temp.totalSubscribers, 0)) as totalSubscribers, 
                sum(IFNULL(temp.upcomingExpiringSubscribers, 0)) as upcomingExpiringSubscribers, 
                sum(IFNULL(temp.totalExpiredSubscribers, 0)) as totalExpiredSubscribers, 
                sum(IFNULL(temp.totalUsers, 0)) as totalUsers, sum(IFNULL(temp.newUsers, 0)) as newUsers, 
                sum(IFNULL(temp.activeUsers, 0)) as activeUsers, 
                sum(IFNULL(temp.inactiveUsers, 0)) as inactiveUsers, 
                sum(IFNULL(temp.income, 0)) as income, sum(IFNULL(temp.totalIncome, 0)) as totalIncome
            from (
                select * from analysis where #{req.endDate} >= dayId and dayId >= #{req.startDate}
            ) as temp group by temp.dayId
        </script>
    """)
    fun someDaysDayAnalysis(@Param("req") req: StatisticsLineChartQueryVo): List<Analysis>

    /**
     * 查询统计数据中昨天统计的总用户数
     * 由于总用户数已经在统计的时候就是查询的汇总数据，故该查询直接查询昨天的统计记录就行，不用在汇总
     */
    @Select("""
        <script>
            select 
                IFNULL(totalUsers, 0) as data, country 
            from analysis where dayId = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d')
            ORDER BY totalUsers DESC
        </script>
    """)
    fun selectAnalysisByCountry(): List<StatisticsUserCountRankingVo>


    /**
     * 折线图:
     * 总订阅、过期订阅、新订阅
     */
    @Select("""
        <script>
        SELECT a.dayId as dateXaxis, sum(ifnull(a.totalSubscribers, 0)) as numYaxis
        FROM analysis as a
        <where>
            <if test = 'req.startDate != null and req.endDate != null'>
                and a.dayId between #{req.startDate} and #{req.endDate}
            </if>
        </where>
        group by dateXaxis
        </script>
    """)
    fun getTotalSubscribersLineChart(@Param("req") req: LineChartReq): List<LineChartResp>

    @Select("""
        <script>
        SELECT a.dayId as dateXaxis, sum(ifnull(a.expiredSubscribers, 0)) as numYaxis
        FROM analysis as a
        <where>
            <if test = 'req.startDate != null and req.endDate != null'>
                and a.dayId between #{req.startDate} and #{req.endDate}
            </if>
        </where>
        group by dateXaxis
        </script>
    """)
    fun getExpiredSubscribersLineChart(@Param("req") req: LineChartReq): List<LineChartResp>

    @Select("""        
        <script>
        SELECT a.dayId as dateXaxis, sum(ifnull(a.newSubscribers, 0)) as numYaxis
        FROM analysis as a
        <where>
            <if test = 'req.startDate != null and req.endDate != null'>
                and a.dayId between #{req.startDate} and #{req.endDate}
            </if>
        </where>
        group by dateXaxis
        </script>
    """)
    fun getNewSubscribersLineChart(@Param("req") req: LineChartReq): List<LineChartResp>

    @Select("""        
        <script>
        SELECT a.dayId as dateXaxis, sum(ifnull(a.totalIncome, 0)) as numYaxis
        FROM analysis as a
        <where>
            <if test = 'req.startDate != null and req.endDate != null'>
                and a.dayId between #{req.startDate} and #{req.endDate}
            </if>
        </where>
        group by dateXaxis
        </script>
    """)
    fun getTotalIncomeLineChart(@Param("req") req: LineChartReq): List<LineChartResp>

    @Select("""        
        <script>
        SELECT a.dayId as dateXaxis, sum(ifnull(a.income, 0)) as numYaxis
        FROM analysis as a
        <where>
            <if test = 'req.startDate != null and req.endDate != null'>
                and a.dayId between #{req.startDate} and #{req.endDate}
            </if>
        </where>
        group by dateXaxis
        </script>
    """)
    fun getDailyIncomeLineChart(@Param("req") req: LineChartReq): List<LineChartResp>

    @Select("""        
        SELECT a.country, a.totalSubscribers as `data`
        FROM analysis as a
        WHERE a.dayId = #{dayId} 
        order by `data` desc
    """)
    fun getCountrySubCountRanking(@Param("dayId") dayId: String): List<RankingResp>

    @Select("""        
        SELECT a.country, a.totalIncome as `data`
        FROM analysis as a
        WHERE a.dayId = #{dayId} 
        order by `data` desc
    """)
    fun getCountryIncomeRanking(@Param("dayId") dayId: String): List<RankingResp>

}