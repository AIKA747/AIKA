package com.parsec.aika.user.service.impl

import cn.hutool.json.JSONObject
import cn.hutool.log.StaticLog
import com.parsec.aika.user.model.em.JobType
import com.parsec.aika.user.service.JobService
import org.quartz.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.quartz.SchedulerFactoryBean
import org.springframework.stereotype.Service


/**
 * @program: quartz
 * @description: service implements
 */
@Service
class JobServiceImpl : JobService {
    @Autowired
    private val schedulerFactoryBean: SchedulerFactoryBean? = null

    /**
     * 创建一个定时任务
     * @param jobId
     * @param jobGroup
     * @param cron
     */
    override fun addJob(jobType: JobType, jobId: String?, jobGroup: String?, cron: String?, data: JSONObject?) {
        try {
            val scheduler = schedulerFactoryBean!!.scheduler
            val jobKey = JobKey.jobKey(jobId, jobGroup)
            var jobDetail = scheduler.getJobDetail(jobKey)
            if (jobDetail != null) {
                StaticLog.info("=========================job:$jobId already exist========================")
                //这里删除任务在新增是可以重新设置cron执行频率
                deleteJob(jobId, jobGroup)
            }
            //构建job信息
            jobDetail = JobBuilder.newJob(jobType.jobClass).withIdentity(jobId, jobGroup).build()
            //用JopDataMap来传递数据
            jobDetail.jobDataMap["data"] = data
            //表达式调度构建器
            val scheduleBuilder = CronScheduleBuilder.cronSchedule(cron)
            //按新的cronExpression表达式构建一个新的trigger
            val trigger = TriggerBuilder.newTrigger().withIdentity(jobId + "_trigger", jobGroup + "_trigger")
                .withSchedule(scheduleBuilder).build()
            scheduler.scheduleJob(jobDetail, trigger)
            StaticLog.info("=========================job:$jobId create success========================")
        } catch (e: Exception) {
            StaticLog.error(e)
            throw e
        }
    }

    /**
     * 暂停任务
     */
    override fun pauseJob(jobId: String?, jobGroup: String?) {
        try {
            val scheduler = schedulerFactoryBean!!.scheduler
            val triggerKey = TriggerKey.triggerKey(jobId + "_trigger", jobGroup + "_trigger")
            scheduler.pauseTrigger(triggerKey)
            StaticLog.info("=========================pause job:$jobId success========================")
        } catch (e: SchedulerException) {
            StaticLog.error(e)
            throw e
        }
    }

    /**
     * 恢复任务
     *
     * @param jobId
     * @param jobGroup
     */
    override fun resumeJob(jobId: String?, jobGroup: String?) {
        try {
            val scheduler = schedulerFactoryBean!!.scheduler
            val triggerKey = TriggerKey.triggerKey(jobId + "_trigger", jobGroup + "_trigger")
            scheduler.resumeTrigger(triggerKey)
            StaticLog.info("=========================resume job:$jobId success========================")
        } catch (e: SchedulerException) {
            StaticLog.error(e)
            throw e
        }
    }

    /**
     * 删除任务
     */
    override fun deleteJob(jobId: String?, jobGroup: String?) {
        try {
            val scheduler = schedulerFactoryBean!!.scheduler
            val jobKey = JobKey.jobKey(jobId, jobGroup)
            scheduler.deleteJob(jobKey)
            StaticLog.info("=========================delete job:$jobId success========================")
        } catch (e: SchedulerException) {
            StaticLog.error(e)
            throw e
        }
    }
}