package com.parsec.aika.user.model.em

enum class JobCategory(val type: JobType) {
    instant(JobType.realTime),
    scheduledSingle(JobType.syncJob),
    scheduledRecurring(JobType.cronJob),
    eventTriggerInactive(JobType.inactiveCheckJob)
}