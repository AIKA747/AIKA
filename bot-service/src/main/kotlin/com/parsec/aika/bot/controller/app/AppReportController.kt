package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.BotReportReq
import com.parsec.aika.bot.model.vo.req.ChatMsgResportReq
import com.parsec.aika.bot.service.AppReportService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.BaseResultCode
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AppReportController {

    @Autowired
    private lateinit var appReportService: AppReportService

    @PostMapping("/app/chat/message/feedback")
    fun chatMsgResport(@Validated @RequestBody req: ChatMsgResportReq, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        appReportService.chatMsgResport(req, loginUserInfo.userId)
        return BaseResult.success()
    }

    @PostMapping("/app/bot/report")
    fun botResport(@Validated @RequestBody req: BotReportReq, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        appReportService.botResport(req, loginUserInfo.userId)
        return BaseResult(BaseResultCode.SUCCESS.code(), "report results will be provided via email.")
    }


}