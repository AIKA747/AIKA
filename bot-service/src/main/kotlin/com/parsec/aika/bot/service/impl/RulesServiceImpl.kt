package com.parsec.aika.bot.service.impl

import com.github.pagehelper.PageHelper
import com.parsec.aika.bot.model.vo.resp.GetAppRulesResp
import com.parsec.aika.bot.service.RulesService
import com.parsec.aika.common.mapper.RulesMapper
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.common.util.PageUtil
import com.parsec.trantor.common.response.PageResult
import org.springframework.stereotype.Service
import javax.annotation.Resource

@Service
class RulesServiceImpl : RulesService {

    @Resource
    private lateinit var rulesMapper: RulesMapper
    override fun getAppRules(pageVo: PageVo): PageResult<GetAppRulesResp> {
        PageHelper.startPage<GetAppRulesResp>(pageVo.pageNo!!, pageVo.pageSize!!)
        return PageUtil<GetAppRulesResp>().page(rulesMapper.getAppRules())
    }
}