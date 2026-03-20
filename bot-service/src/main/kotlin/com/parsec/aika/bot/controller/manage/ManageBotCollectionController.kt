package com.parsec.aika.bot.controller.manage

import com.parsec.aika.bot.model.vo.req.CreateBotCollectionItemRequest
import com.parsec.aika.bot.model.vo.req.CreateBotCollectionRequest
import com.parsec.aika.bot.model.vo.resp.BotCollectionItemResp
import com.parsec.aika.bot.model.vo.resp.BotCollectionResp
import com.parsec.aika.bot.service.BotCollectionService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageBotCollectionController {

    @Resource
    private lateinit var botCollectionService: BotCollectionService


    @GetMapping("/manage/sphere")
    fun pageQuery(
        @RequestParam(defaultValue = "1") pageNum: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): BaseResult<PageResult<BotCollectionResp>> {
        return BaseResult.success(botCollectionService.pageQuery(pageNum, pageSize))
    }

    @PostMapping("/manage/sphere")
    fun createBotCollect(@RequestBody @Validated req: CreateBotCollectionRequest, loginUser: LoginUserInfo): BaseResult<BotCollectionResp> {
        return BaseResult.success(botCollectionService.create(req, loginUser))
    }

    @PutMapping("/manage/sphere")
    fun updateBotCollect(@RequestBody @Validated req: CreateBotCollectionRequest, loginUser: LoginUserInfo): BaseResult<Int> {
        return BaseResult.success(botCollectionService.update(req, loginUser))
    }

    @DeleteMapping("/manage/sphere/{id}")
    fun deleteBotCollect(@PathVariable id: Long): BaseResult<Int> {
        return BaseResult.success(botCollectionService.delete(id))
    }

    @PostMapping("/manage/sphere/bot")
    fun createBotCollectionItem(
        @RequestBody @Validated req: CreateBotCollectionItemRequest, loginUser: LoginUserInfo
    ): BaseResult<BotCollectionItemResp> {
        return BaseResult.success(botCollectionService.createBotCollectionItem(req, loginUser))
    }

    @DeleteMapping("/manage/sphere/bot/{id}")
    fun deleteBotCollectionItem(@PathVariable id: Long): BaseResult<Int> {
        return BaseResult.success(botCollectionService.deleteBotCollectionItem(id))
    }

    @GetMapping("/manage/sphere/bot")
    fun botCollectionItemPageQuery(
        @RequestParam(defaultValue = "1") pageNum: Int,
        @RequestParam(defaultValue = "10") pageSize: Int,
        @RequestParam(required = false) collectionId: Long?
    ): BaseResult<PageResult<BotCollectionItemResp>> {
        return BaseResult.success(botCollectionService.botCollectionItemPageQuery(pageNum, pageSize, collectionId))
    }
}
