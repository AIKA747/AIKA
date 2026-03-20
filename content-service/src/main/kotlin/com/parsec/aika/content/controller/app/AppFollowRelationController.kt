package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.service.FollowRelationService
import com.parsec.trantor.common.response.BaseResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

@RestController
class AppFollowRelationController {

    @Resource
    private lateinit var followRelationService: FollowRelationService

    /**
     * 修改机器人形象（新）
     */
    @PutMapping("/app/bot-image")
    fun updateFollowBotImage(@RequestBody @Validated vo: com.parsec.aika.common.model.vo.req.BotImageUpdateVo, user: LoginUserInfo): BaseResult<String> {
        followRelationService.updateBotImage(vo.botId!!, vo.botImage!!, user)
        return BaseResult.success("success")
    }
}
