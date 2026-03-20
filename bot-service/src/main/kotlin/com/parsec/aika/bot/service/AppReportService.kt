package com.parsec.aika.bot.service

import cn.hutool.core.lang.Assert
import cn.hutool.json.JSONUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.model.vo.req.BotReportReq
import com.parsec.aika.bot.model.vo.req.ChatMsgResportReq
import com.parsec.aika.common.mapper.ContentReportMapper
import com.parsec.aika.common.model.entity.ContentReport
import com.parsec.aika.common.model.entity.ReportType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AppReportService {

    @Autowired
    private lateinit var contentReportMapper: ContentReportMapper

    fun chatMsgResport(req: ChatMsgResportReq, userId: Long?) {
        contentReportMapper.insert(ContentReport().apply {
            this.reportType = ReportType.msg
            this.userId = userId
            this.json = JSONUtil.toJsonStr(req)
        })
    }

    fun botResport(req: BotReportReq, userId: Long?) {
        //查询用户是否存在未处理的举报
        val count = contentReportMapper.selectCount(
            KtQueryWrapper(ContentReport::class.java).eq(ContentReport::reportType, ReportType.bot)
                .eq(ContentReport::userId, userId).eq(ContentReport::status, 0)
        )
        Assert.state(
            count == 0,
            "You have already submitted 1 report. Please refrain from making frequent reports until our investigation is complete."
        )
        contentReportMapper.insert(ContentReport().apply {
            this.reportType = ReportType.bot
            this.userId = userId
            this.json = JSONUtil.toJsonStr(req)
        })
    }

}