package com.parsec.aika.bot.service

import com.parsec.aika.bot.model.vo.resp.GetAppRulesResp
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.PageResult

interface RulesService {
    fun getAppRules(pageVo: PageVo): PageResult<GetAppRulesResp>
}