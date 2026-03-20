package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.req.LineChartReq
import com.parsec.aika.admin.model.vo.resp.LineChartResp
import com.parsec.aika.admin.model.vo.resp.RankingResp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping

interface LineChartService {

    fun getTotalSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp>

    fun getExpiredSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp>

    fun getNewSubscribersLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp>

    fun getTotalIncomeLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp>

    fun getDailyIncomeLineChart(req: LineChartReq, loginUserInfo: LoginUserInfo): List<LineChartResp>

    fun getCountrySubCountRanking(req: PageVo, loginUserInfo: LoginUserInfo): List<RankingResp>

    fun getCountryIncomeRanking(req: PageVo, loginUserInfo: LoginUserInfo): List<RankingResp>
}