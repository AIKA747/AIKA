package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.CreateBotCollectionItemRequest
import com.parsec.aika.bot.model.vo.req.CreateBotCollectionRequest
import com.parsec.aika.bot.model.vo.req.GetBotCollectionItemReq
import com.parsec.aika.bot.model.vo.resp.BotCollectionItemResp
import com.parsec.aika.bot.model.vo.resp.BotCollectionResp
import com.parsec.aika.bot.model.vo.resp.GetAppBotCollectionItemResp
import com.parsec.aika.bot.model.vo.resp.GetAppBotCollectionResp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.PageResult

interface BotCollectionService {
    fun pageBotCollection(req: PageVo): PageResult<GetAppBotCollectionResp>
    fun pageBotCollectionItem(req: GetBotCollectionItemReq): PageResult<GetAppBotCollectionItemResp>

    fun pageQuery(pageNum: Int, pageSize: Int): PageResult<BotCollectionResp>

    fun create(request: CreateBotCollectionRequest, loginUser: LoginUserInfo): BotCollectionResp

    fun update(request: CreateBotCollectionRequest, loginUser: LoginUserInfo): Int

    fun delete(id: Long): Int

    fun botCollectionItemPageQuery(pageNum: Int, pageSize: Int, collectionId: Long?): PageResult<BotCollectionItemResp>

    fun createBotCollectionItem(request: CreateBotCollectionItemRequest, loginUser: LoginUserInfo): BotCollectionItemResp

    fun deleteBotCollectionItem(id: Long): Int

    fun listBotCollection(size: Int): List<GetAppBotCollectionResp>?

}
