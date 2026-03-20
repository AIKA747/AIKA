package com.parsec.aika.content.controller.manage

import cn.hutool.core.lang.Assert
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.service.CategoryService
import com.parsec.trantor.common.response.BaseResult
import com.parsec.trantor.common.response.PageResult
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.annotation.Resource

@RestController
class ManageCategoryController {

    @Resource
    private lateinit var categoryService: CategoryService


    @GetMapping("/manage/category")
    fun getCategoryList(
        pageNo: Int? = null, pagerSize: Int? = null, name: String? = null, user: LoginUserInfo
    ): BaseResult<PageResult<com.parsec.aika.common.model.vo.resp.CategoryVo>> {
        return BaseResult.success(categoryService.getCategoryList(pageNo, pagerSize, name))
    }

    @PostMapping("/manage/category")
    fun saveCategory(@Validated @RequestBody req: com.parsec.aika.common.model.vo.req.ManageCategoryReq, user: LoginUserInfo): BaseResult<String?> {
        return BaseResult.success(categoryService.saveCategory(req, user)?.id.toString())
    }

    @PutMapping("/manage/category")
    fun updateCategory(@Validated @RequestBody req: com.parsec.aika.common.model.vo.req.ManageCategoryReq, user: LoginUserInfo): BaseResult<*> {
        Assert.notNull(req.id, "category id can not be null")
        return BaseResult.success(categoryService.updateCategory(req, user))
    }

    @DeleteMapping("/manage/category/{id}")
    fun deleteCategroy(@PathVariable id: Long, user: LoginUserInfo): BaseResult<*> {
        return BaseResult.success(categoryService.deleteCategroy(id))
    }


}
