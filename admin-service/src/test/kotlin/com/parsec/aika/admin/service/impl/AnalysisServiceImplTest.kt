package com.parsec.aika.admin.service.impl

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.admin.model.vo.resp.GetIncomeDataResp
import com.parsec.aika.admin.model.vo.resp.GetSubDataResp
import com.parsec.aika.admin.model.vo.resp.RemoteUserNumData
import com.parsec.aika.admin.remote.OrderFeignClient
import com.parsec.aika.admin.remote.UserFeignClient
import com.parsec.aika.admin.service.AnalysisService
import com.parsec.aika.common.mapper.AnalysisMapper
import com.parsec.aika.common.model.entity.Analysis
import com.parsec.trantor.common.response.BaseResult
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.mockito.Mockito
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class AnalysisServiceImplTest {

    @Resource
    private lateinit var analysisService: AnalysisService

    @MockBean
    private lateinit var orderFeignClient: OrderFeignClient

    @MockBean
    private lateinit var userFeignClient: UserFeignClient

    @Resource
    private lateinit var analysisMapper: AnalysisMapper

    @Test
    @Rollback
    @Transactional
    fun saveUserAnalysis() {
        val incomeVo = GetIncomeDataResp().apply {
            this.income = 122
            this.totalIncome = 3212
        }
        Mockito.doReturn(BaseResult.success(incomeVo)).`when`(orderFeignClient).getFeignIncomeData(Mockito.anyString(), Mockito.anyString())

        val subDataResp = GetSubDataResp().apply {
            this.expiredSubscribers = 121
            this.newSubscribers = 3
            this.totalSubscribers = 320
            this.totalExpiredSubscribers = 212
            this.upcomingExpiringSubscribers = 32
        }
        Mockito.doReturn(BaseResult.success(subDataResp)).`when`(orderFeignClient).getFeignSubscribersData(Mockito.anyString(), Mockito.anyString())

        val countryList = mutableListOf<String>()
        countryList.add("aaa")
        countryList.add("bbb")
        countryList.add("ccc")
        countryList.add("ddd")
        Mockito.doReturn(BaseResult.success(countryList)).`when`(userFeignClient).getUserCountryList()

        val userNumData = RemoteUserNumData().apply {
            this.activeUsers = 12
            this.newUsers = 2
            this.inactiveUsers = 3
            this.totalUsers = 26
        }
        Mockito.doReturn(BaseResult.success(userNumData)).`when`(userFeignClient).getUserNums(Mockito.anyString(), Mockito.anyString())

        val date = "20040122"
        analysisService.saveUserAnalysis(date)

        // 能查询到该日期存入的数据，且每个国家一条（countryList）
        val list = analysisMapper.selectList(KtQueryWrapper(Analysis::class.java).eq(Analysis::dayId, date))
        assertNotNull(list)
        list.map {
            assertEquals(it.dayId, date)
            assertTrue(countryList.contains(it.country))
        }
    }
}