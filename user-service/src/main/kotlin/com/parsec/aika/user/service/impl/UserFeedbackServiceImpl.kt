package com.parsec.aika.user.service.impl

import cn.hutool.core.bean.BeanUtil
import cn.hutool.core.lang.Assert
import cn.hutool.core.lang.id.NanoId
import cn.hutool.core.thread.ThreadUtil
import cn.hutool.core.util.StrUtil
import cn.hutool.json.JSONObject
import cn.hutool.json.JSONUtil
import cn.hutool.log.StaticLog
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.model.bo.FeedbackEmailNotifyBO
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.utils.PageUtil
import com.parsec.aika.user.config.EmailNotifyMqConst.EMAIL_NOTIFY_EXCHANGE
import com.parsec.aika.user.config.EmailNotifyMqConst.EMAIL_NOTIFY_FEEDBACK_ROUTE_KEY
import com.parsec.aika.user.mapper.UserFeedbackMapper
import com.parsec.aika.user.mapper.UserFeedbackOperationLogsMapper
import com.parsec.aika.user.model.entity.FeedbackStatus
import com.parsec.aika.user.model.entity.UserFeedback
import com.parsec.aika.user.model.entity.UserFeedbackOperationLogs
import com.parsec.aika.user.model.vo.req.*
import com.parsec.aika.user.model.vo.resp.UserFeedbackDetailResp
import com.parsec.aika.user.model.vo.resp.UserFeedbackListResp
import com.parsec.aika.user.model.vo.resp.UserFeedbackManageListResp
import com.parsec.aika.user.remote.BotFeignClient
import com.parsec.aika.user.service.EmailService
import com.parsec.aika.user.service.UserFeedbackService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import javax.annotation.PreDestroy
import javax.annotation.Resource

@Service
class UserFeedbackServiceImpl : UserFeedbackService {

    @Autowired
    private lateinit var userFeedbackMapper: UserFeedbackMapper

    @Autowired
    private lateinit var userFeedbackOperationLogsMapper: UserFeedbackOperationLogsMapper

    @Autowired
    private lateinit var emailService: EmailService

    @Resource
    private lateinit var botFeignClient: BotFeignClient

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    private final val iuess_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toCharArray()

    private final val user_feedback_msg_description_temp =
        "We have received your feedback {} request. It is currently under review, and once approved, we will proceed with the necessary actions."
    private final val user_feedback_reply_msg_description_temp =
        "Your feedback regarding {} has been addressed. Thank you once again for your attention and support."

    private final val feedback_title_dic_type = "feedbackTitle"

    //超级管理员id
    private final val super_admin_id = 1000000L

    private val executorService = ThreadUtil.newExecutor(5, 20)

    @PreDestroy
    fun destroy() {
        executorService.shutdown()
    }


    override fun queryAppUserFeedbackList(
        pageNo: Int?, pageSize: Int?, userId: Long?, listType: String?
    ): PageResult<UserFeedbackListResp> {
        val page = Page<UserFeedbackListResp>(pageNo!!.toLong(), pageSize!!.toLong())
        return PageUtil<UserFeedbackListResp>().page(userFeedbackMapper.queryAppUserFeedbackList(page, userId, listType))
    }

    override fun userFeedbackInfo(id: Long?): UserFeedbackDetailResp? {
        val feedback = userFeedbackMapper.selectById(id) ?: throw BusinessException("Data does not exist")
        return BeanUtil.copyProperties(feedback, UserFeedbackDetailResp::class.java).apply {
            this.operationLogs = userFeedbackOperationLogsMapper.selectList(
                KtQueryWrapper(UserFeedbackOperationLogs::class.java).eq(UserFeedbackOperationLogs::feedbackId, id)
                    .orderByDesc(UserFeedbackOperationLogs::operationTime)
            )
        }
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun saveFeedback(req: UserFeedbackSaveReq, user: LoginUserInfo): UserFeedbackDetailResp? {
        //填充titleValue值
        val dicResult = botFeignClient.getDicList(feedback_title_dic_type)
        if (dicResult.isSuccess) {
            if (dicResult.data.find { it.dicValue == req.title } == null) {
                req.titleValue = "Other"
            } else {
                req.titleValue = req.title
            }
        }
        val userFeedback = BeanUtil.copyProperties(req, UserFeedback::class.java)
        userFeedback.submissionAt = LocalDateTime.now()
        userFeedback.userId = user.userId
        userFeedback.username = user.username
        userFeedback.email = user.email
        userFeedback.status = FeedbackStatus.underReview
        userFeedback.iuessId = this.createIuessId()
        userFeedbackMapper.insert(userFeedback)
        //保存操作记录
        this.saveOperationLogs(
            userFeedback.id,
            user.userId,
            user.username,
            FeedbackStatus.underReview,
            "Submit feedback",
            UserTypeEnum.APPUSER
        )
        //给用户发送邮件
        if (StrUtil.isNotBlank(user.email)) {
            executorService.execute {
                try {
                    val map = HashMap<String, Any>()
                    map["description"] = StrUtil.format(user_feedback_msg_description_temp, userFeedback.iuessId)
                    emailService.sendMail(user.email!!, "Thank you for your feedback", map, "feedback")
                } catch (e: Exception) {
                    StaticLog.error(e)
                }
            }
        }
        //给管理员发送邮件通知有新的用户反馈
        rabbitTemplate.convertAndSend(
            EMAIL_NOTIFY_EXCHANGE, EMAIL_NOTIFY_FEEDBACK_ROUTE_KEY, JSONUtil.toJsonStr(FeedbackEmailNotifyBO().apply {
                feedbackType = userFeedback.category
                issueId = userFeedback.iuessId
                username = user.username
                feedbackTime = userFeedback.createdAt ?: LocalDateTime.now()
                feedbackId = userFeedback.id.toString()
            })
        )
        return userFeedbackInfo(userFeedback.id)
    }

    override fun reportQuantity(req: FeedbackStatisticsReq, user: LoginUserInfo): List<JSONObject>? {
        return userFeedbackMapper.reportQuantity(req)
    }

    override fun titleStatistics(req: FeedbackStatisticsReq, user: LoginUserInfo): List<JSONObject>? {
        val dicResult = botFeignClient.getDicList(feedback_title_dic_type)
        return if (dicResult.isSuccess) {
            val titleList = dicResult.data.map { it.dicValue!! }
            titleList.plus("Other")
            userFeedbackMapper.titleStatistics(req, titleList)
        } else {
            emptyList()
        }

    }

    override fun statusStatistics(req: FeedbackStatisticsReq, user: LoginUserInfo): List<JSONObject>? {
        return userFeedbackMapper.statusStatistics(req, FeedbackStatus.values().toList().map { it.name })
    }

    override fun queryManageUserFeedbackList(req: ManageFeedbackListReq): PageResult<UserFeedbackManageListResp>? {
        val ktQueryWrapper = KtQueryWrapper(UserFeedback::class.java).select(
            UserFeedback::id,
            UserFeedback::title,
            UserFeedback::titleValue,
            UserFeedback::userId,
            UserFeedback::username,
            UserFeedback::email,
            UserFeedback::device,
            UserFeedback::systemVersion,
            UserFeedback::category,
            UserFeedback::status,
            UserFeedback::submissionAt
        ).like(StrUtil.isNotBlank(req.title), UserFeedback::title, req.title)
            .like(StrUtil.isNotBlank(req.username), UserFeedback::username, req.username)
            .like(StrUtil.isNotBlank(req.category), UserFeedback::category, req.category)
            .like(StrUtil.isNotBlank(req.device), UserFeedback::device, req.device)
            .like(StrUtil.isNotBlank(req.systemVersion), UserFeedback::systemVersion, req.systemVersion)
            .le(StrUtil.isNotBlank(req.maxSubmissionAt), UserFeedback::submissionAt, req.maxSubmissionAt)
            .ge(StrUtil.isNotBlank(req.minSubmissionAt), UserFeedback::submissionAt, req.minSubmissionAt)
            .eq(null != req.status, UserFeedback::status, req.status)
            .eq(StrUtil.isNotBlank(req.titleValue), UserFeedback::titleValue, req.titleValue)
            .like(StrUtil.isNotBlank(req.iuessId), UserFeedback::iuessId, req.iuessId)
            .orderByDesc(UserFeedback::submissionAt)

        val page = Page<UserFeedback>(req.pageNo!!.toLong(), req.pageSize!!.toLong())
        val pageResult = userFeedbackMapper.selectPage(page, ktQueryWrapper)
        return PageResult<UserFeedbackManageListResp>().apply {
            this.list = pageResult.records.map {
                BeanUtil.copyProperties(it, UserFeedbackManageListResp::class.java)
            }
            this.pageNum = pageResult.current
            this.pageSize = pageResult.size
            this.pages = pageResult.pages
            this.total = pageResult.total
        }
    }

    override fun replyFeedback(req: ManageFeedbackReplyReq, user: LoginUserInfo): UserFeedbackDetailResp? {
        val userFeedback = userFeedbackMapper.selectById(req.id) ?: throw BusinessException("Data does not exist")
        Assert.state(
            userFeedback.status == FeedbackStatus.pending, "Feedback current status cannot be replied to temporarily"
        )
        //校验一下数据权限，是否为第一次用户操作得数据或超级管理员操作数据
        Assert.state(
            userFeedback.adminId == user.userId || user.userId == super_admin_id,
            "No operation permission for this data"
        )
        userFeedback.status = FeedbackStatus.completed
        userFeedback.replyAt = LocalDateTime.now()
        userFeedback.replyContent = req.replyContent
        userFeedback.replyImages = req.replyImages
        userFeedbackMapper.updateById(userFeedback)
        //保存操作记录
        this.saveOperationLogs(
            userFeedback.id, user.userId, user.username, FeedbackStatus.completed, "Feedback reply", user.userType!!
        )
        //发送邮件给用户
        if (StrUtil.isNotBlank(userFeedback.email)) {
            executorService.execute {
                try {
                    val map = HashMap<String, Any>()
                    map["description"] = StrUtil.format(user_feedback_reply_msg_description_temp, userFeedback.iuessId)
                    emailService.sendMail(userFeedback.email!!, "Thank you for your support", map, "feedback")
                } catch (e: Exception) {
                    StaticLog.error(e)
                }
            }
        }
        return userFeedbackInfo(userFeedback.id)
    }

    override fun withdrawFeedback(id: Long, user: LoginUserInfo): UserFeedbackDetailResp? {
        val userFeedback = userFeedbackMapper.selectById(id) ?: throw BusinessException("Data does not exist")
        //校验反馈数据状态
        Assert.state(userFeedback.status != FeedbackStatus.completed, "Feedback completed cannot be withdrawn")
        Assert.state(userFeedback.status != FeedbackStatus.rejected, "Feedback rejected cannot be withdrawn")
        //修改为撤销状态
        userFeedback.status = FeedbackStatus.withdraw
        userFeedbackMapper.updateById(userFeedback)
        //保存操作记录
        this.saveOperationLogs(
            userFeedback.id, user.userId, user.username, FeedbackStatus.withdraw, "User Recall", user.userType!!
        )
        return userFeedbackInfo(userFeedback.id)
    }

    @Transactional(rollbackFor = [Exception::class])
    override fun updateFeedbackStatus(req: FeedbackStatusReq, user: LoginUserInfo): UserFeedbackDetailResp? {
        val userFeedback = userFeedbackMapper.selectById(req.id) ?: throw BusinessException("Data does not exist")
        Assert.state(
            listOf(
                FeedbackStatus.underReview, FeedbackStatus.rejected, FeedbackStatus.pending
            ).contains(req.status)
        )
        if (req.status == FeedbackStatus.pending) {
            Assert.state(
                userFeedback.status == FeedbackStatus.underReview,
                "Feedback current status[${userFeedback.status}] cannot update to pending"
            )
            userFeedback.adminId = user.userId
        }
        if (req.status == FeedbackStatus.rejected) {
            Assert.state(
                userFeedback.status == FeedbackStatus.underReview,
                "Feedback current status[${userFeedback.status}] cannot update to rejected"
            )
            userFeedback.adminId = user.userId
        }
        if (req.status == FeedbackStatus.underReview) {
            Assert.state(
                userFeedback.status == FeedbackStatus.pending,
                "Feedback current status[${userFeedback.status}] cannot update to underReview"
            )
            //校验一下数据权限，是否为第一次用户操作得数据或超级管理员操作数据
            Assert.state(
                userFeedback.adminId == user.userId || user.userId == super_admin_id,
                "No operation permission for this data"
            )
        }
        userFeedback.status = req.status
        userFeedbackMapper.updateById(userFeedback)
        //保存操作记录
        this.saveOperationLogs(
            userFeedback.id,
            user.userId,
            user.username,
            FeedbackStatus.rejected,
            "Feedback status update to ${userFeedback.status}",
            user.userType!!
        )
        return userFeedbackInfo(req.id!!)
    }

    /**
     * 保存操作记录
     */
    private fun saveOperationLogs(
        feedbackId: Long?,
        userId: Long?,
        username: String?,
        status: FeedbackStatus,
        remark: String,
        userType: UserTypeEnum
    ) {
        userFeedbackOperationLogsMapper.insert(UserFeedbackOperationLogs().apply {
            this.feedbackId = feedbackId
            this.status = status
            this.operationUserId = userId
            this.operationUser = username
            this.operationTime = LocalDateTime.now()
            this.remark = remark
            this.userType = userType
        })
    }

    private fun createIuessId(): String? {
        //生成iuessId
        val iuessId = NanoId.randomNanoId(null, iuess_chars, 7)
        val count =
            userFeedbackMapper.selectCount(KtQueryWrapper(UserFeedback::class.java).eq(UserFeedback::iuessId, iuessId))
        //有重复的，则重新生成一下
        if (count > 0) {
            return createIuessId()
        }
        return iuessId
    }


}