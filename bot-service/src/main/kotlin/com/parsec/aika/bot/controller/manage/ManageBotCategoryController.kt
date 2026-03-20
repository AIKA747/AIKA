package com.parsec.aika.bot.controller.manage

import cn.hutool.core.lang.Assert
import com.parsec.aika.bot.model.vo.req.ManageCategoryBotQueryVo
import com.parsec.aika.bot.model.vo.req.ManageCategoryCreateVo
import com.parsec.aika.bot.model.vo.req.ManageCategoryUpdateVo
import com.parsec.aika.bot.model.vo.resp.ManageBotCategoryDetailVo
import com.parsec.aika.bot.model.vo.resp.ManageBotCategoryListVo
import com.parsec.aika.bot.model.vo.resp.ManageCategoryBotListVo
import com.parsec.aika.bot.model.vo.resp.ManageCategoryListVo
import com.parsec.aika.bot.service.BotCategoryService
import com.parsec.aika.bot.service.BotService
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.annotation.Resource

@RestController
class ManageBotCategoryController {

    @Resource
    private lateinit var botCategoryService: BotCategoryService

    @Resource
    private lateinit var botService: BotService

    /**
     * 机器人栏目列表
     */
    @GetMapping("/manage/bot/category")
    fun botCategoryList(pageVo: PageVo, user: LoginUserInfo): BaseResult<PageResult<ManageBotCategoryListVo>> {
        return BaseResult.success(botCategoryService.manageBotCategorys(pageVo, user))
    }

    /**
     * 机器人栏目管理列表
     */
    @GetMapping("/manage/category")
    fun categoryList(pageVo: PageVo, user: LoginUserInfo): BaseResult<PageResult<ManageCategoryListVo>> {
        return BaseResult.success(botCategoryService.manageCategorys(pageVo, user))
    }

    /**
     * 机器人栏目详情
     */
    @GetMapping("/manage/category/{id}")
    fun botCategoryDetail(@PathVariable id: Long, user: LoginUserInfo): BaseResult<ManageBotCategoryDetailVo> {
        return BaseResult.success(botCategoryService.manageBotCategoryDetail(id, user))
    }

    /**
     * 删除机器人栏目信息
     */
    @DeleteMapping("/manage/category/{id}")
    fun botCategoryDelete(@PathVariable id: Long, user: LoginUserInfo): BaseResult<Void> {
        botCategoryService.manageBotCategoryDelete(id, user)
        return BaseResult.success()
    }

    /**
     * 创建机器人栏目信息
     */
    @PostMapping("/manage/category")
    fun botCategoryCreate(
        @Validated @RequestBody reqVo: ManageCategoryCreateVo, user: LoginUserInfo
    ): BaseResult<Void> {
        botCategoryService.manageCategoryCreate(reqVo, user)
        return BaseResult.success()
    }

    /**
     * 修改机器人栏目信息
     */
    @PutMapping("/manage/category")
    fun botCategoryUpdate(
        @Validated @RequestBody reqVo: ManageCategoryUpdateVo, user: LoginUserInfo
    ): BaseResult<Void> {
        botCategoryService.manageCategoryUpdate(reqVo, user)
        return BaseResult.success()
    }

    /**
     * 机器人列表
     * 栏目编辑时选择机器人调用的查询列表接口
     */
    @GetMapping("/manage/category/bots")
    fun botList(
        queryVo: ManageCategoryBotQueryVo, user: LoginUserInfo
    ): BaseResult<PageResult<ManageCategoryBotListVo>> {
        return BaseResult.success(botService.manageCategorySearchBot(queryVo, user))
    }

    @GetMapping("/manage/category/can-select-bots")
    fun botNotCategoryBotList(
        queryVo: ManageCategoryBotQueryVo, user: LoginUserInfo
    ): BaseResult<PageResult<ManageCategoryBotListVo>> {
        Assert.notNull(queryVo.categoryId, "param categoryId can not be null")
        return BaseResult.success(botService.manageCategorySelectBots(queryVo, user))
    }


}