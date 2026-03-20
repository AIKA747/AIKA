package com.parsec.aika.content.service.impl

import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.PostReportAuthorMapper
import com.parsec.aika.common.mapper.PostReportMapper
import com.parsec.aika.common.model.bo.ReportEmailNotifyBO
import com.parsec.aika.common.model.entity.PostReport
import com.parsec.aika.common.model.entity.PostReportAuthor
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManagePostReportReq
import com.parsec.aika.common.model.vo.resp.PostReportResp
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.config.EmailNotifyMqConst.EMAIL_NOTIFY_EXCHANGE
import com.parsec.aika.content.config.EmailNotifyMqConst.EMAIL_NOTIFY_REPORT_ROUTE_KEY
import com.parsec.aika.content.service.PostReportService
import com.parsec.trantor.common.response.PageResult
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import jakarta.annotation.Resource

@Service
class PostReportServiceImpl : PostReportService {

    @Resource
    private lateinit var postReportMapper: PostReportMapper

    @Resource
    private lateinit var postReportAuthorMapper: PostReportAuthorMapper

    @Resource
    private lateinit var rabbitTemplate: RabbitTemplate

    override fun reportList(): List<PostReport>? {
        return postReportMapper.selectList(
            KtQueryWrapper(PostReport::class.java).select(
                PostReport::id, PostReport::title, PostReport::description
            ).orderByDesc(PostReport::sortNo)
        )
    }

    override fun reportPost(reportId: Int, postId: Int, user: LoginUserInfo) {
        //取消之前的举报
        this.cancelPostReport(postId, user)
        //查询举报分类信息
        val postReport = postReportMapper.selectById(reportId)

        val reportAuthor = PostReportAuthor().apply {
            this.reportId = reportId
            this.postId = postId
            this.author = user.userId
        }
        //添加举报记录
        postReportAuthorMapper.insert(reportAuthor)
        //发送邮件
        rabbitTemplate.convertAndSend(
            EMAIL_NOTIFY_EXCHANGE, EMAIL_NOTIFY_REPORT_ROUTE_KEY, JSONUtil.toJsonStr(ReportEmailNotifyBO().apply {
                this.reportId = postId.toString()
                this.reportType = postReport.title
                this.authorName = user.nickname
                this.reportTime = reportAuthor.createdAt ?: LocalDateTime.now()
            })
        )
    }

    override fun cancelPostReport(postId: Int, user: LoginUserInfo): Int {
        return postReportAuthorMapper.delete(
            KtQueryWrapper(PostReportAuthor::class.java).eq(PostReportAuthor::postId, postId)
                .eq(PostReportAuthor::author, user.userId)
        )
    }

    override fun postReportList(req: ManagePostReportReq): PageResult<PostReportResp>? {
        val page = Page<PostReportResp>((req.pageNo ?: 0).toLong(), (req.pageSize ?: 10).toLong())
        return PageUtil<PostReportResp>().page(postReportAuthorMapper.postReportList(page, req))
    }


}