package com.parsec.aika.user.scheduler.job

import cn.hutool.extra.spring.SpringUtil
import com.parsec.aika.user.mapper.PushJobMapper
import com.parsec.aika.user.service.PushListService
import org.quartz.Job
import org.quartz.JobExecutionContext
import org.springframework.scheduling.quartz.SchedulerFactoryBean

abstract class CommonJob : Job {

    private var pushListService: PushListService? = null

    private var schedulerFactoryBean: SchedulerFactoryBean? = null

    private var pushJobMapper: PushJobMapper? = null

    protected fun getPushListService(): PushListService? {
        if (null == pushListService) {
            pushListService = SpringUtil.getBean(PushListService::class.java)
        }
        return pushListService
    }

    protected fun getSchedulerFactoryBean(): SchedulerFactoryBean? {
        if (null == schedulerFactoryBean) {
            schedulerFactoryBean = SpringUtil.getBean(SchedulerFactoryBean::class.java)
        }
        return schedulerFactoryBean
    }

    protected fun getPushJobMapper(): PushJobMapper? {
        if (null == pushJobMapper) {
            pushJobMapper = SpringUtil.getBean(PushJobMapper::class.java)
        }
        return pushJobMapper
    }

    protected fun deleteJob(context: JobExecutionContext) {
        getSchedulerFactoryBean()!!.scheduler.deleteJob(context.jobDetail.key)
    }
}