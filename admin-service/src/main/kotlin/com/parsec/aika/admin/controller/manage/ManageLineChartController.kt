package com.parsec.aika.admin.controller.manage

import com.github.pagehelper.PageHelper
import com.parsec.aika.admin.model.vo.req.LineChartReq
import com.parsec.aika.admin.model.vo.resp.GetOperationLogsResp
import com.parsec.aika.admin.model.vo.resp.LineChartResp
import com.parsec.aika.admin.model.vo.resp.RankingResp
import com.parsec.aika.admin.service.LineChartService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageLineChartController {

    @Resource
    private lateinit var lineChartService: LineChartService

    /**
     * 总订阅者折线图
     */
    @GetMapping("/total-subscribers/line-chart")
    fun getTotalSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): BaseResult<List<LineChartResp>> {
        return BaseResult.success(lineChartService.getTotalSubscribersLineChart(req, loginUserInfo))
    }

    /**
     * 过期订阅者折线图
     */
    @GetMapping("/expired-subscribers/line-chart")
    fun getExpiredSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): BaseResult<List<LineChartResp>> {
        return BaseResult.success(lineChartService.getExpiredSubscribersLineChart(req, loginUserInfo))
    }

    /**
     * 新订阅者折线图
     */
    @GetMapping("/new-subscribers/line-chart")
    fun getNewSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): BaseResult<List<LineChartResp>> {
        return BaseResult.success(lineChartService.getNewSubscribersLineChart(req, loginUserInfo))
    }

    /**
     * 总收入折线图
     */
    @GetMapping("/total-income/line-chart")
    fun getTotalIncomeLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): BaseResult<List<LineChartResp>> {
        return BaseResult.success(lineChartService.getTotalIncomeLineChart(req, loginUserInfo))
    }

    /**
     * 日收入折线图
     */
    @GetMapping("/daily-income/line-chart")
    fun getDailyIncomeLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): BaseResult<List<LineChartResp>> {
        return BaseResult.success(lineChartService.getDailyIncomeLineChart(req, loginUserInfo))
    }

    /**
     * 订阅者数量统计排名
     */
    @GetMapping("/country/subscriber-count-ranking")
    fun getCountrySubCountRanking(req: PageVo, loginUserInfo: LoginUserInfo): BaseResult<PageResult<RankingResp>> {
        return BaseResult.success(PageUtil<RankingResp>().page(lineChartService.getCountrySubCountRanking(req, loginUserInfo)))
    }

    /**
     * 收入统计排名
     */
    @GetMapping("/country/income-ranking")
    fun getCountryIncomeRanking(req: PageVo, loginUserInfo: LoginUserInfo): BaseResult<PageResult<RankingResp>> {
        return BaseResult.success(PageUtil<RankingResp>().page(lineChartService.getCountryIncomeRanking(req, loginUserInfo)))
    }
}