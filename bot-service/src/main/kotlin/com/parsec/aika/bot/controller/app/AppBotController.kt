package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.req.*
import com.parsec.aika.bot.model.vo.resp.*
import com.parsec.aika.bot.service.BotService
import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.em.BotStatusEnum
import com.parsec.aika.common.model.em.RedisKeyPrefix
import com.parsec.aika.common.model.entity.RoleProfession
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class AppBotController {

    @Resource
    private lateinit var botService: BotService

    @Resource
    private lateinit var stringRedisTemplate: StringRedisTemplate

    /**
     * 查询机器人详情
     */
    @GetMapping("/app/bot/{id}")
    fun getBotInfo(
        @PathVariable("id") id: Long,
        botStatus: BotStatusEnum?,
        user: LoginUserInfo
    ): BaseResult<AppBotDetailVO> {
        return BaseResult.success(botService.appBotDetail(id, botStatus, user))
    }

    /**
     * 新建机器人
     */
    @PostMapping("/app/bot")
    fun postAppBot(@RequestBody @Validated req: PostAppBotReq, loginUser: LoginUserInfo): BaseResult<BotDetailVO> {
        return BaseResult.success(botService.postAppBot(req, loginUser));
    }

    /**
     * 发布机器人
     */
    @PutMapping("/app/bot/{id}/release")
    fun putAppBotIdRelease(@PathVariable id: Long, loginUser: LoginUserInfo): BaseResult<Void> {
        botService.putAppBotIdRelease(id, loginUser)
        return BaseResult.success();
    }

    /**
     * 机器人列表
     */
    @GetMapping("/app/my-bots")
    fun getAppMyBots(req: GetAppMyBotsReq, loginUser: LoginUserInfo): BaseResult<PageResult<GetAppMyBotsResp>> {
        req.creator = loginUser.userId
        return BaseResult.success(botService.getAppMyBots(req))
    }

    /**
     * 机器人栏目列表
     */
    @GetMapping("/app/bot/category")
    fun getAppBotCategory(req: GetAppBotCategoryReq): BaseResult<PageResult<GetAppBotCategoryResp>> {
        return BaseResult.success(botService.getAppBotCategory(req))
    }

    /**
     * 编辑机器人
     */
    @PutMapping("/app/bot/{id}")
    fun putAppBotId(
        @PathVariable id: Long, @RequestBody @Validated req: PutAppBotIdReq, loginUser: LoginUserInfo
    ): BaseResult<BotDetailVO> {
        return BaseResult.success(botService.putAppBotId(id, req, loginUser))
    }

    // 删除机器人
    @DeleteMapping("/app/bot/{id}")
    fun deleteBot(@PathVariable("id") id: Long, user: LoginUserInfo): BaseResult<Void> {
        botService.appDeleteBot(id, user)
        return BaseResult.success()
    }

    /**
     * 机器人检索
     */
    @GetMapping("/app/explore-bots")
    fun getAppExploreBots(
        req: GetAppExploreBotsReq, loginUser: LoginUserInfo
    ): BaseResult<PageResult<GetAppExploreBotsResp>> {
        return BaseResult.success(botService.getAppExploreBots(req, loginUser))
    }


    /**
     * 查询指定用户的机器人列表
     */
    @GetMapping("/app/owner-bots")
    fun getAppOwnerBots(req: GetAppOwnerBotsReq): BaseResult<PageResult<GetAppOwnerBotsResp>> {
        return BaseResult.success(botService.getAppOwnerBots(req))
    }

    @TranslateResult
    @GetMapping("/app/recommend-bots")
    fun getAppRecommendBots(
        req: GetAppRecommendBotsReq, loginUser: LoginUserInfo
    ): BaseResult<PageResult<GetAppRecommendBotsResp>> {
        req.creator = loginUser.userId!!.toLong()
        return BaseResult.success(botService.getAppRecommendBots(req))
    }

    @GetMapping("/app/keywords")
    fun getAppKeywords(loginUser: LoginUserInfo): BaseResult<List<String>> {
        return BaseResult.success(
            stringRedisTemplate.opsForZSet().reverseRange(RedisKeyPrefix.botkeywordexplore.name, 0, -1)?.take(10)
                ?: emptyList()
        )
    }

    @GetMapping("/app/profession")
    fun getBotPofessions(pageVo: PageVo): BaseResult<PageResult<RoleProfession>> {
        return BaseResult.success(botService.getBotPofessions(pageVo))
    }

    @PostMapping("/test/syncBotList")
    fun syncBotList(): BaseResult<*> {
        botService.syncBotList()
        return BaseResult.success()
    }

}