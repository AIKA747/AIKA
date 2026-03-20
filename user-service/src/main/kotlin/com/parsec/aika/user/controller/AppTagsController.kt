package com.parsec.aika.user.controller

import com.parsec.aika.common.aspect.TranslateResult
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import com.parsec.aika.user.service.InterestTagsService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.annotation.Resource

@RestController
class AppTagsController {

    @Resource
    private lateinit var interestTagsService: InterestTagsService

    /**
     * 获取标签列表
     * 返回的分页对象的数据，tagName的数组
     */
    @GetMapping("/app/tags")
    @TranslateResult
    fun getTagList(pageVo: PageVo, user: LoginUserInfo): BaseResult<PageResult<String>> {
        return BaseResult.success(interestTagsService.tagNameList(pageVo))
    }

}