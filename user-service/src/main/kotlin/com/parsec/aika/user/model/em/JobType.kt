package com.parsec.aika.user.model.em

import com.parsec.aika.user.scheduler.job.*
import org.quartz.Job

enum class JobType(val jobClass: Class<out Job>?) {
    realTime(null),
    cronJob(CronJob::class.java),
    syncJob(AsyncJob::class.java),
    inactiveCheckJob(InactiveUserCheckJob::class.java),
    botPostJob(BotPostJob::class.java),
    botUserTaskJob(BotUserTaskJob::class.java),
    dailyJob(DailyJob::class.java),
    fileClearJob(FileClearJob::class.java),
    rekognitionJob(RekognitionJob::class.java)
}