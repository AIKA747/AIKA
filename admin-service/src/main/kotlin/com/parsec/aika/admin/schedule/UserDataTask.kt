package com.parsec.aika.admin.schedule

import cn.hutool.log.StaticLog
import com.parsec.aika.admin.service.AnalysisService
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.Executor
import javax.annotation.Resource

@Component
class UserDataTask {

    @Resource
    @Qualifier("taskExecutor")
    private lateinit var taskExecutor: Executor

    @Resource
    private lateinit var analysisService: AnalysisService

    /**
     * 每天凌晨1点统计前一天的用户数据
     */
    @Scheduled(cron = "0 0 1 * * ? ")
//    @Scheduled(cron = "* * * * * ? ")
    fun dayUserRecord() {
//        println("统计前一天的用户记录数据")
        StaticLog.info("dayUserRecord,time:{}", LocalDateTime.now())
        taskExecutor.execute(this::executeYesterdayUserData)
    }

    /**
     * 查询前一天用户数据，并保存统计数据
     */
    fun executeYesterdayUserData() {
        // 得到昨天的日期
        val yesterday = LocalDate.now().minusDays(1)
        // 得到昨天日期的string格式
        val dateFormat = DateTimeFormatter.ofPattern("yyyyMMdd")
        val date = yesterday.format(dateFormat)
        StaticLog.info("dayUserRecord,yesterday:{}", date)
        analysisService.saveUserAnalysis(date)
    }


}

