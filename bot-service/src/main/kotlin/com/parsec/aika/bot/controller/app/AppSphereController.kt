package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.GetBotCollectionItemReq
import com.parsec.aika.bot.model.vo.resp.GetAppBotCollectionItemResp
import com.parsec.aika.bot.model.vo.resp.GetAppBotCollectionResp
import com.parsec.aika.bot.service.BotCollectionService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppSphereController {

    @Resource
    private lateinit var botCollectionService: BotCollectionService

    @GetMapping("/app/sphere")
    fun appSphere(req: PageVo, loginUser: LoginUserInfo): BaseResult<PageResult<GetAppBotCollectionResp>> {
        return BaseResult.success(botCollectionService.pageBotCollection(req))
    }

    @GetMapping("/app/sphere/all")
    fun appSphereAll(
        @RequestParam(defaultValue = "20") size: Int? = null,
        loginUser: LoginUserInfo
    ): BaseResult<List<GetAppBotCollectionResp>> {
        return BaseResult.success(botCollectionService.listBotCollection(size ?: 20))
    }

    @GetMapping("/app/sphere/bot")
    fun appSphereBot(
        @Validated req: GetBotCollectionItemReq,
        loginUser: LoginUserInfo
    ): BaseResult<PageResult<GetAppBotCollectionItemResp>> {
        return BaseResult.success(botCollectionService.pageBotCollectionItem(req))
    }

}
