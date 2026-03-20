package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.AppAssistantGenderReq
import com.parsec.aika.bot.model.vo.req.AppAssistantMsgRecordQueryVo
import com.parsec.aika.bot.model.vo.req.BadAnswerReq
import com.parsec.aika.bot.model.vo.req.ManageAssistantEditVo
import com.parsec.aika.bot.model.vo.resp.AppAssistantResp
import com.parsec.aika.bot.model.vo.resp.AppChatRecordListVo
import com.parsec.aika.common.model.entity.Assistant
import com.parsec.aika.common.model.entity.UserAssistant
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

interface AssistantService {

    /**
     * 编辑助手
     * 数据库有数据，则修改，无数据则新增
     * 即数据库中的助手最多只有一条
     */
    fun manageAssistantEdit(assistant: ManageAssistantEditVo, user: LoginUserInfo): Assistant

    /**
     * 查询助手配置
     * 数据库最多只会有一条数据
     */
    fun manageAssistantDetail(): Assistant

    /**
     * 查询助手配置
     */
    fun appAssistantDetail(user: LoginUserInfo): AppAssistantResp

    /**
     * 设置助手性别
     */
    fun appAssistantUpdGender(vo: AppAssistantGenderReq, user: LoginUserInfo)

    /**
     * 查询用户与助手的聊天记录
     */
    fun appAssistantChatRecordList(
        req: AppAssistantMsgRecordQueryVo,
        user: LoginUserInfo
    ): PageResult<AppChatRecordListVo>

    /**
     * 查询用户得助手设置
     */
    fun getUserAssistant(userId: Long, user: LoginUserInfo? = null): UserAssistant

    /**
     * 生成prompt
     */
    fun generatePrompt(
        assistantId: Long,
        userAssistant: UserAssistant,
        locale: String,
        digitHuman: Boolean?,
        username: String?
    ): Pair<Assistant, String>

    fun getPublicAssistantInfo(): AppAssistantResp?
    fun badAnswer(req: BadAnswerReq)
}