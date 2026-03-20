package com.parsec.aika.user.model.entity

import com.baomidou.mybatisplus.annotation.TableField
import com.baomidou.mybatisplus.annotation.TableName
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler
import com.parsec.aika.common.model.entity.BaseDomain
import com.parsec.aika.user.model.em.JobCategory
import com.parsec.aika.user.model.em.JobType
import java.time.LocalDateTime

@TableName("`push_job`", autoResultMap = true)
class PushJob : BaseDomain() {

    /**
     * 任务名称
     */
    var name: String? = null

    /**
     * 任务类型：cronJob,syncJob,inactiveCheckJob
     */
    @TableField("`type`")
    var type: JobType? = null

    /**
     * 任务类型：instant实时推送,scheduledSingle单次定时推送,scheduledRecurring定时循环推送,eventTriggerInactive不活跃用户事件推送
     */
    @TableField("`category`")
    var category: JobCategory? = null

    /**
     * cron表达式
     */
    var cron: String? = null

    /**
     * 任务执行参数
     */
    @TableField(typeHandler = JacksonTypeHandler::class)
    var body: PushBody? = null

    /**
     * 备注字段
     */
    var remark: String? = null

    /**
     * pending待执行或执行中，executed已执行
     */
    @TableField("`status`")
    var status: JobStatus? = null

    /**
     * 是否已执行过：0未执行，1已执行
     */
    var excuted: Boolean? = null

    /**
     * 是否系统任务
     */
    var sysJob: Boolean? = null

    /**
     * 执行时间
     */
    var excutedAt: LocalDateTime? = null

    /**
     * 操作者
     */
    var operator: String? = null


    var creator: Long? = null
}

enum class JobStatus {

    /**
     * 等待执行
     */
    waiting,

    /**
     * 执行中
     */
    pending,

    /**
     * 已执行
     */
    executed
}

class PushBody {
    var title: String? = null
    var content: String? = null
    var pushTo: String? = null
    var soundAlert: Boolean? = null
    var inactiveDays: Int? = null
    var pushTime: String? = null
    var stopTime: String? = null
}