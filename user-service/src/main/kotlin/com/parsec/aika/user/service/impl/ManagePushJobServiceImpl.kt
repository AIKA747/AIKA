package com.parsec.aika.user.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.json.JSONObject
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.mapper.PushJobMapper
import com.parsec.aika.user.model.em.JobType
import com.parsec.aika.user.model.entity.JobStatus
import com.parsec.aika.user.model.entity.PushJob
import com.parsec.aika.user.model.vo.req.ManageJobEditReq
import com.parsec.aika.user.model.vo.req.ManagePushJobListReq
import com.parsec.aika.user.model.vo.req.PostPushListReq
import com.parsec.aika.user.model.vo.resp.ManagePushJobListResp
import com.parsec.aika.user.service.JobService
import com.parsec.aika.user.service.ManagePushJobService
import com.parsec.aika.user.service.PushListService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class ManagePushJobServiceImpl : ManagePushJobService {

    @Autowired
    private lateinit var jobService: JobService

    @Autowired
    private lateinit var pushListService: PushListService

    @Autowired
    private lateinit var pushJobMapper: PushJobMapper

    private final val jobGroup = "push_job"

    override fun pushJobList(req: ManagePushJobListReq): PageResult<ManagePushJobListResp>? {
        val page = Page<ManagePushJobListResp>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        if (req.sysJob == null) {
            req.sysJob = false
        }
        return PageUtil<ManagePushJobListResp>().page(pushJobMapper.pushJobList(page, req))
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun editPushJob(req: ManageJobEditReq, user: LoginUserInfo): PushJob? {
        if (null != req.id) {
            this.deletePushJob(req.id!!)
        }
        val pushJob = PushJob().apply {
            category = req.category
            type = req.category!!.type
            cron = req.cron
            body = req.body
            status = JobStatus.waiting
            operator = user.username
            creator = user.userId
            remark = req.remark
            name = req.name
            sysJob = req.sysJob ?: false
        }
        pushJobMapper.insert(pushJob)
        if (pushJob.type == JobType.realTime) {
            pushListService.postPushList(PostPushListReq().apply {
                BeanUtil.copyProperties(pushJob.body, this)
                this.jobId = pushJob.id
            }, user)
            pushJob.status = JobStatus.executed
            pushJob.excuted = true
            pushJob.excutedAt = LocalDateTime.now()
            pushJobMapper.updateById(pushJob)
        } else {
            jobService.addJob(pushJob.type!!, pushJob.id.toString(), jobGroup, req.cron, JSONObject(pushJob))
        }
        return pushJob
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun updateJobStatus(id: Long, status: Boolean): PushJob? {
        val pushJob = pushJobMapper.selectById(id) ?: throw BusinessException("job not exit")
        pushJobMapper.updateById(pushJob)
        if (status) {
            jobService.resumeJob(id.toString(), jobGroup)
        } else {
            jobService.pauseJob(id.toString(), jobGroup)
        }
        return pushJob
    }

    override fun deletePushJob(id: Long) {
        pushJobMapper.deleteById(id)
        jobService.deleteJob(id.toString(), jobGroup)
    }

    override fun cronConverter(dateTime: LocalDateTime): String {
        val second = dateTime.second.toString()
        val minute = dateTime.minute.toString()
        val hour = dateTime.hour.toString()
        val dayOfMonth = dateTime.dayOfMonth.toString()
        val month = dateTime.monthValue.toString()
        return "$second $minute $hour $dayOfMonth $month ?"
    }

    override fun jobDetail(id: Long?): PushJob? {
        return pushJobMapper.selectById(id) ?: throw BusinessException("job not exit")
    }


}