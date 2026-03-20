package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.vo.resp.CategoryVo
import com.parsec.aika.content.service.CategoryService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import jakarta.annotation.Resource

@RestController
class AppCategoryController {

    @Resource
    private lateinit var categoryService: CategoryService

    @GetMapping("/app/category")
    fun getCategoryList(
        pageNo: Int? = null, pagerSize: Int? = null, name: String? = null
    ): BaseResult<PageResult<CategoryVo>> {
        return BaseResult.success(categoryService.getAppCategoryList(pageNo, pagerSize, name))
    }


}
