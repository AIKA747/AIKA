package com.parsec.aika.admin.controller.manage

import com.parsec.aika.admin.model.vo.resp.*
import com.parsec.aika.admin.service.AnalysisService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageAnalyticsSubController {

    @Resource
    private lateinit var analysisService: AnalysisService

    /**
     * 订阅者数量统计
     */
    @GetMapping("/analytics/subscribers/num")
    fun getAnalyticsSubscribersNum(loginUserInfo: LoginUserInfo): BaseResult<GetAdminAnalyticsSubscribersNumResp> {
        return BaseResult.success(analysisService.getAnalyticsSubscribersNum())
    }

    /**
     * 月订阅
     */
    @GetMapping("/analytics/new-subscribers/month")
    fun getAnalyticsNewSubscribersMonth(loginUserInfo: LoginUserInfo): BaseResult<GetAdminAnalyticsNewSubscribersMonthResp> {
        return BaseResult.success(analysisService.getAnalyticsNewSubscribersMonth())
    }

    /**
     * 周新订阅
     */
    @GetMapping("/analytics/new-subcribers/week")
    fun getAnalyticsNewSubscribersWeek(loginUserInfo: LoginUserInfo): BaseResult<GetAdminAnalyticsNewSubscribersWeekResp> {
        return BaseResult.success(analysisService.getAnalyticsNewSubscribersWeek())
    }

    /**
     * 年收入统计
     */
    @GetMapping("/analytics/income/year")
    fun getAnalyticsIncomeYear(loginUserInfo: LoginUserInfo): BaseResult<GetAdminAnalyticsIncomeYearResp> {
        return BaseResult.success(analysisService.getAnalyticsIncomeYear())
    }

    /**
     * 月收入统计
     */
    @GetMapping("/analytics/income/month")
    fun getAnalyticsIncomeMonth(loginUserInfo: LoginUserInfo): BaseResult<GetAdminAnalyticsIncomeMonthResp> {
        return BaseResult.success(analysisService.getAnalyticsIncomeMonth())
    }

    /**
     * 周收入统计
     */
    @GetMapping("/analytics/income/week")
    fun getAnalyticsIncomeWeek(loginUserInfo: LoginUserInfo): BaseResult<GetAdminAnalyticsIncomeWeekResp> {
        return BaseResult.success(analysisService.getAnalyticsIncomeWeek())
    }


}