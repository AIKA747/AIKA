package com.parsec.aika.user.model.vo.req

import com.parsec.aika.user.model.em.JobCategory
import com.parsec.aika.user.model.entity.PushBody
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

class ManageJobEditReq {

    /**
     *数据id
     */
    var id: Long? = null


    var name: String? = null

    /**
     * 任务类型：cronJob,syncJob,inactiveCheckJob
     */
    @NotNull
    var category: JobCategory? = null

    /**
     * cron表达式
     */
    @NotBlank
    var cron: String? = null

    /**
     * 推送任务执行参数
     */
    @NotNull
    var body: PushBody? = null

    /**
     * 备注字段
     */
    var remark: String? = null

    /**
     * 是否系统任务
     */
    var sysJob: Boolean? = null
}