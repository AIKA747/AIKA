package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.model.vo.req.ManageAssistantEditVo
import com.parsec.aika.bot.service.AssistantService
import com.parsec.aika.common.model.entity.Assistant
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class ManageAssistantController {

    @Resource
    private lateinit var assistantService: AssistantService

    /**
     * 编辑助手
     */
    @PostMapping("/manage/assistant")
    fun addOrEditAssistant(@Validated @RequestBody assistant: ManageAssistantEditVo, user: LoginUserInfo): BaseResult<Assistant> {
        return BaseResult.success(assistantService.manageAssistantEdit(assistant, user))
    }

    /**
     * 获取助手配置
     */
    @GetMapping("/manage/assistant")
    fun getAssistantConfig(user: LoginUserInfo): BaseResult<Assistant> {
        // 由于助手配置只有一条，直接查询该数据
        return BaseResult.success(assistantService.manageAssistantDetail())
    }


}