package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.ManageCategoryCreateVo
import com.parsec.aika.bot.model.vo.req.ManageCategoryUpdateVo
import com.parsec.aika.bot.model.vo.resp.ManageBotCategoryDetailVo
import com.parsec.aika.bot.model.vo.resp.ManageBotCategoryListVo
import com.parsec.aika.bot.model.vo.resp.ManageCategoryListVo
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.PageResult

interface BotCategoryService {

    /**
     * 机器人栏目列表
     */
    fun manageBotCategorys(pageVo: PageVo, loginUser: LoginUserInfo): PageResult<ManageBotCategoryListVo>

    /**
     * 机器人栏目列表
     */
    fun manageCategorys(pageVo: PageVo, loginUser: LoginUserInfo): PageResult<ManageCategoryListVo>

    /**
     * 机器人栏目详情
     */
    fun manageBotCategoryDetail(id: Long, loginUser: LoginUserInfo): ManageBotCategoryDetailVo

    /**
     * 删除机器人栏目
     */
    fun manageBotCategoryDelete(id: Long, loginUser: LoginUserInfo)

    /**
     * 新建机器人栏目
     */
    fun manageCategoryCreate(reqVo: ManageCategoryCreateVo, user: LoginUserInfo)

    /**
     * 修改机器人栏目
     */
    fun manageCategoryUpdate(reqVo: ManageCategoryUpdateVo, user: LoginUserInfo)
}