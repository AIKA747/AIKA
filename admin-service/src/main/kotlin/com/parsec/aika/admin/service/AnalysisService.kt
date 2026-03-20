package com.parsec.aika.admin.service

import com.parsec.aika.admin.model.vo.resp.*
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult

interface AnalysisService {

    /**
     * 统计某天的用户数据
     */
    fun saveUserAnalysis(date: String)

    fun getAnalyticsSubscribersNum(): GetAdminAnalyticsSubscribersNumResp

    fun getAnalyticsNewSubscribersMonth(): GetAdminAnalyticsNewSubscribersMonthResp

    fun getAnalyticsNewSubscribersWeek(): GetAdminAnalyticsNewSubscribersWeekResp

    fun getAnalyticsIncomeYear(): GetAdminAnalyticsIncomeYearResp

    fun getAnalyticsIncomeMonth(): GetAdminAnalyticsIncomeMonthResp

    fun getAnalyticsIncomeWeek(): GetAdminAnalyticsIncomeWeekResp
}