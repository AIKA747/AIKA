package com.parsec.aika.user.controller


import cn.hutool.core.lang.Assert
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.user.model.em.JobCategory
import com.parsec.aika.user.model.entity.PushJob
import com.parsec.aika.user.model.vo.req.ManageJobEditReq
import com.parsec.aika.user.model.vo.req.ManagePushJobListReq
import com.parsec.aika.user.model.vo.resp.ManagePushJobListResp
import com.parsec.aika.user.service.ManagePushJobService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*


/**
 * @program: quartz
 * @description: JobController
 */
@RestController
class ManagePushJobController {
    @Autowired
    private lateinit var managePushJobService: ManagePushJobService

    @GetMapping("/manage/push-job-list")
    fun jobList(req: ManagePushJobListReq): BaseResult<PageResult<ManagePushJobListResp>> {
        return BaseResult.success(managePushJobService.pushJobList(req))
    }

    @GetMapping("/manage/push-job-detail")
    fun jobDetail(id: Long?): BaseResult<PushJob> {
        return BaseResult.success(managePushJobService.jobDetail(id))
    }

    @PostMapping("/manage/push-job")
    fun editPushJob(@Validated @RequestBody req: ManageJobEditReq, user: LoginUserInfo): BaseResult<PushJob> {
        Assert.notBlank(req.body?.title, "title cannot null")
        Assert.notBlank(req.body?.content, "content cannot null")
        Assert.notBlank(req.body?.pushTo, "pushTo cannot null")
        Assert.notNull(req.body?.soundAlert, "soundAlert cannot null")
        if (req.category == JobCategory.eventTriggerInactive) {
            Assert.notNull(req.body?.inactiveDays, "inactiveDays cannot null")
            Assert.state(req.body?.inactiveDays!! > 0, "inactiveDays param error")
        } else if (req.category == JobCategory.scheduledSingle) {
            Assert.notNull(req.body?.pushTime, "pushTime cannot null")
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
            val dateTime = LocalDateTime.parse(req.body?.pushTime, formatter)
            Assert.state(dateTime.isAfter(LocalDateTime.now()), "pushTime must after now")
            req.cron = managePushJobService.cronConverter(dateTime)
        } else if (req.category == JobCategory.instant) {
            req.cron = "* * * * * ?"
        }
        return BaseResult.success(managePushJobService.editPushJob(req, user))
    }

    @PatchMapping("/manage/push-job/{id}/{status}")
    fun updateJobStatus(@PathVariable("id") id: Long, @PathVariable("status") status: Boolean): BaseResult<PushJob> {
        return BaseResult.success(managePushJobService.updateJobStatus(id, status))
    }

    @DeleteMapping("/manage/push-job/{id}")
    fun deletePushJob(@PathVariable("id") id: Long): BaseResult<Void> {
        managePushJobService.deletePushJob(id)
        return BaseResult.success()
    }
}