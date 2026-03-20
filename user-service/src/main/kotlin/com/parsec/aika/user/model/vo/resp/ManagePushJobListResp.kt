package com.parsec.aika.user.model.vo.resp

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.parsec.aika.user.model.em.JobCategory
import com.parsec.aika.user.model.em.JobType
import com.parsec.aika.user.model.entity.JobStatus
import java.time.LocalDateTime

class ManagePushJobListResp {

    @JsonSerialize(using = ToStringSerializer::class)
    var id: Long? = null

    var name: String? = null

    /**
     * 任务类型：instant实时推送,scheduledSingle单次定时推送,scheduledRecurring定时循环推送,eventTriggerInactive不活跃用户事件推送
     */
    var category: JobCategory? = null

    /**
     * 任务类型：cronJob,syncJob,inactiveCheckJob
     */
    var type: JobType? = null

    /**
     * cron表达式
     */
    var cron: String? = null

    var status: JobStatus? = null

    /**
     * 是否已执行过：0未执行，1已执行
     */
    var excuted: Boolean? = null

    /**执行时间
     *
     */
    var excutedAt: LocalDateTime? = null

    /**
     * 创建时间
     */
    var createdAt: LocalDateTime? = null
}