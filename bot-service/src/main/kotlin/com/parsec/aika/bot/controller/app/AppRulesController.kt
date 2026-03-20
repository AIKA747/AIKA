package com.parsec.aika.bot.controller.app

import com.parsec.aika.bot.model.vo.resp.GetAppRulesResp
import com.parsec.aika.bot.service.RulesService
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppRulesController {

    @Resource
    private lateinit var rulesService: RulesService

    @GetMapping("/app/rules")
    fun getAppRules(pageVo: PageVo): BaseResult<PageResult<GetAppRulesResp>> {
        return BaseResult.success(rulesService.getAppRules(pageVo))
    }
}