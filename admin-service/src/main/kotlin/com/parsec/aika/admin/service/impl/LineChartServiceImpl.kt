package com.parsec.aika.admin.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.github.pagehelper.PageHelper
import com.parsec.aika.admin.model.vo.req.LineChartReq
import com.parsec.aika.admin.model.vo.resp.GetEmailLogsResp
import com.parsec.aika.admin.model.vo.resp.LineChartResp
import com.parsec.aika.admin.model.vo.resp.RankingResp
import com.parsec.aika.admin.service.LineChartService
import com.parsec.aika.common.mapper.AnalysisMapper
import com.parsec.aika.common.model.entity.Analysis
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import javax.annotation.Resource

@Service
class LineChartServiceImpl : LineChartService {

    @Resource
    private lateinit var analysisMapper: AnalysisMapper

    /**
     * 总订阅者折线图
     */
    override fun getTotalSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp> {
        return analysisMapper.getTotalSubscribersLineChart(req)
    }

    /**
     * 过期订阅者折线图
     */
    override fun getExpiredSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp> {
        return analysisMapper.getExpiredSubscribersLineChart(req)
    }

    /**
     * 新订阅者折线图
     */
    override fun getNewSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp> {
        return analysisMapper.getNewSubscribersLineChart(req)
    }

    /**
     * 总收入折线图
     */
    override fun getTotalIncomeLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp> {
        return analysisMapper.getTotalIncomeLineChart(req)
    }

    /**
     * 日收入折线图
     */
    override fun getDailyIncomeLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp> {
        return analysisMapper.getDailyIncomeLineChart(req)
    }


    private val yesterday = LocalDate.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"))

    /**
     * 订阅者数量统计排名
     */
    override fun getCountrySubCountRanking(req: PageVo, loginUserInfo: LoginUserInfo): List<RankingResp> {
        PageHelper.startPage<RankingResp>(req.pageNo!!, req.pageSize!!)
        return analysisMapper.getCountrySubCountRanking(yesterday)
    }

    /**
     * 收入统计排名
     */
    override fun getCountryIncomeRanking(req: PageVo, loginUserInfo: LoginUserInfo): List<RankingResp> {
        PageHelper.startPage<RankingResp>(req.pageNo!!, req.pageSize!!)
        return analysisMapper.getCountryIncomeRanking(yesterday)
    }

}