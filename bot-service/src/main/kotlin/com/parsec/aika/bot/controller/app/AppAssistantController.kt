package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.AppAssistantGenderReq
import com.parsec.aika.bot.model.vo.req.AppAssistantMsgRecordQueryVo
import com.parsec.aika.bot.model.vo.req.BadAnswerReq
import com.parsec.aika.bot.model.vo.resp.AppAssistantResp
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.bot.service.AssistantService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppAssistantController {

    @Resource
    private lateinit var assistantService: AssistantService

    /**
     * 获取助手配置
     */
    @GetMapping("/app/assistant")
    fun getAssistantInfo(user: LoginUserInfo): BaseResult<AppAssistantResp> {
        return BaseResult.success(assistantService.appAssistantDetail(user))
    }

    /**
     * 获取助手配置
     */
    @GetMapping("/public/assistant")
    fun getPublicAssistantInfo(): BaseResult<AppAssistantResp> {
        return BaseResult.success(assistantService.getPublicAssistantInfo())
    }

    /**
     * 设置助手性别
     */
    @PostMapping("/app/assistant/gender")
    fun setAssistantGender(@Validated @RequestBody vo: AppAssistantGenderReq, user: LoginUserInfo): BaseResult<Void> {
        assistantService.appAssistantUpdGender(vo, user)
        return BaseResult.success()
    }

    /**
     * 查询与助手的聊天记录
     */
    @GetMapping("/app/assistant/chat-record")
    fun getChatRecord(
        vo: AppAssistantMsgRecordQueryVo, user: LoginUserInfo
    ): BaseResult<PageResult<AppChatRecordListVo>> {
        return BaseResult.success(assistantService.appAssistantChatRecordList(vo, user))
    }

    @PutMapping("/app/assistant/chat-record/bad")
    fun badAnswer(@RequestBody req: BadAnswerReq): BaseResult<Void> {
        assistantService.badAnswer(req)
        return BaseResult.success()
    }


}