package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.req.GetAppRateReq
import com.parsec.aika.bot.model.vo.req.PostAppRateReq
import com.parsec.aika.bot.model.vo.resp.GetAppRateResp
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.trantor.common.response.PageResult

interface BotRateService {
    fun getAppRate(req: GetAppRateReq): PageResult<GetAppRateResp>

    fun postAppRate(req: PostAppRateReq, loginUserInfo: LoginUserInfo)

    /**
     * 用户是否可评论该机器人
     */
    fun canCommented(botId: Long, userId: Long): Boolean
}