package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.model.vo.resp.GetManageBotRecommendResp
import com.parsec.aika.bot.model.vo.resp.GetManageBotsResp
import com.parsec.aika.bot.model.vo.resp.ManageBotDetailVO
import com.parsec.aika.bot.model.vo.resp.ManageBotRecommendDetail
import com.parsec.aika.bot.service.BotService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageBotController {

    @Resource
    private lateinit var botService: BotService

    /**
     * 机器人推荐详情
     */
    @GetMapping("/manage/bot/{id}/recommend")
    fun botRecommendDetail(@PathVariable id: Long, loginUser: LoginUserInfo): BaseResult<ManageBotRecommendDetail> {
        return BaseResult.success(botService.manageBotRecommendDetail(id, loginUser))
    }

    /**
     * 编辑机器人
     */
    @PutMapping("/manage/bot/{id}")
    fun putManageBotId(
        @PathVariable id: Long, @RequestBody @Validated req: PutAppBotIdReq, loginUser: LoginUserInfo
    ): BaseResult<Void> {
        botService.putManageBotId(id, req, loginUser)
        return BaseResult.success()
    }

    /**
     * 机器人详情
     */
    @GetMapping("/manage/bot/{id}")
    fun botDetail(@PathVariable id: Long, user: LoginUserInfo): BaseResult<ManageBotDetailVO> {
        return BaseResult.success(botService.manageBotDetail(id, user))
    }

    /**
     * 取消推荐
     */
    @PutMapping("/manage/bot/{id}/unrecommend")
    fun cancelRecommendation(@PathVariable id: Long, user: LoginUserInfo): BaseResult<Void> {
        botService.manageCancelRecommend(id, user)
        return BaseResult.success()
    }

    /**
     * 机器人列表
     */
    @GetMapping("/manage/bot/recommend")
    fun getManageBotRecommend(
        req: GetManageBotRecommendReq, loginUser: LoginUserInfo
    ): BaseResult<PageResult<GetManageBotRecommendResp>> {
        return BaseResult.success(botService.getManageBotRecommend(req, loginUser))
    }

    /**
     * 推荐排序
     */
    @PutMapping("/manage/bot/recommend/sort")
    fun putManageBotRecommendSort(
        @RequestBody @Validated req: PutManageBotRecommendSortReq, user: LoginUserInfo
    ): BaseResult<Void> {
        botService.putManageBotRecommendSort(req, user)
        return BaseResult.success()
    }

    /**
     * 上线/下线
     */
    @PutMapping("/manage/bot/status")
    fun putManageBotStatus(@RequestBody @Validated req: PutManageBotStatusReq, user: LoginUserInfo): BaseResult<Void> {
        botService.putManageBotStatus(req, user)
        return BaseResult.success()
    }

    /**
     * 推荐机器人
     */
    @PutMapping("/manage/bot/recommend")
    fun putManageBotRecommend(
        @RequestBody @Validated req: PutManageBotRecommendReq, user: LoginUserInfo
    ): BaseResult<Void> {
        botService.putManageBotRecommend(req, user)
        return BaseResult.success()
    }

    /**
     * 新建机器人
     */
    @PostMapping("/manage/bot")
    fun postManageBot(@RequestBody @Validated req: PostManageBotReq, loginUser: LoginUserInfo): BaseResult<Long> {
        return BaseResult.success(botService.postManageBot(req, loginUser))
    }


    /**
     * 机器人列表
     */
    @GetMapping("/manage/bots")
    fun getManageBots(req: GetManageBotsReq, loginUser: LoginUserInfo): BaseResult<PageResult<GetManageBotsResp>> {
        return BaseResult.success(botService.getManageBots(req, loginUser))
    }

    @DeleteMapping("/manage/bot/{id}")
    fun deleteBot(@PathVariable id: Long): BaseResult<Any> {
        return BaseResult.success(botService.deleteBot(id))
    }

    @GetMapping("/manage/export/bot-conversation-count")
    fun botConversationCount(): ResponseEntity<ByteArray> {
        val bytes = botService.botConversationCount()
        return ResponseEntity.ok().headers(HttpHeaders().apply {
            add("Content-Disposition", "attachment; filename=bot_conversation_${System.currentTimeMillis()}.xls")
            contentType = MediaType.APPLICATION_OCTET_STREAM
        }).body(bytes)
    }
}