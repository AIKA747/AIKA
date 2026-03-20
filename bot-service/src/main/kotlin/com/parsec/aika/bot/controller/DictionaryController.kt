package com.parsec.aika.bot.controller

import com.parsec.aika.bot.service.DictionaryService
import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.entity.Dictionary
import com.parsec.trantor.common.response.BaseResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppDictionaryController {

    @Resource
    private lateinit var dictionaryService: DictionaryService

    /**
     * 字典查询接口
     *
     * dicType: 字典类型：botRules，botProfession，botConversationStyle
     */
    @GetMapping("/app/dic")
    @TranslateResult
    fun getAppDicList(dicType: String?): BaseResult<List<Dictionary>> {
        return BaseResult.success(dictionaryService.appDictionaryList(dicType))
    }

    /**
     * 字典查询接口
     *
     * dicType: 字典类型：botRules，botProfession，botConversationStyle
     */
    @GetMapping("/manage/dic")
    fun getManageDicList(dicType: String?): BaseResult<List<Dictionary>> {
        return BaseResult.success(dictionaryService.appDictionaryList(dicType))
    }

    @GetMapping("/feign/dic")
    fun getDicList(dicType: String?): BaseResult<List<Dictionary>> {
        return BaseResult.success(dictionaryService.appDictionaryList(dicType))
    }

}