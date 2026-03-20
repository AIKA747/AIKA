package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.service.GiftService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

/**
 * @author RainLin
 * @since 2024/1/26 11:20
 */
@RestController
class AppGiftController {

    @Resource
    private lateinit var giftService: GiftService

    // 故事列表
    @GetMapping("/app/gift")
    fun getAppGift(
        @Validated req: com.parsec.aika.common.model.vo.req.GetAppGiftReq,
        loginUserInfo: LoginUserInfo
    ): BaseResult<PageResult<com.parsec.aika.common.model.vo.resp.GetAppGiftResp>> {
        return BaseResult.success(giftService.getAppGift(req, loginUserInfo))
    }
}
