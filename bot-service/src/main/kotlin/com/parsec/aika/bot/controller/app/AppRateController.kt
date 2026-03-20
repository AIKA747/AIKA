package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.GetAppRateReq
import com.parsec.aika.bot.model.vo.req.PostAppRateReq
import com.parsec.aika.bot.model.vo.resp.GetAppRateResp
import com.parsec.aika.bot.service.BotRateService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppRateController {

    @Resource
    private lateinit var botRateService: BotRateService

    @GetMapping("/app/rate")
    fun getAppRate(req: GetAppRateReq): BaseResult<PageResult<GetAppRateResp>> {
        return BaseResult.success(botRateService.getAppRate(req))
    }

    @PostMapping("/app/rate")
    fun postAppRate(@RequestBody @Validated req: PostAppRateReq, loginUserInfo: LoginUserInfo): BaseResult<Void> {
        botRateService.postAppRate(req, loginUserInfo)
        return BaseResult.success()
    }
}