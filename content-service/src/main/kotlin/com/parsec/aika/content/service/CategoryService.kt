package com.parsec.aika.content.service

import com.parsec.aika.common.model.entity.Category
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManageCategoryReq
import com.parsec.aika.common.model.vo.resp.CategoryVo
import com.parsec.trantor.common.response.PageResult

interface CategoryService {
    /**
     * 保存分类
     */
    fun saveCategory(req: ManageCategoryReq, user: LoginUserInfo): Category?

    /**
     * 更新分类
     */
    fun updateCategory(req: ManageCategoryReq, user: LoginUserInfo): Int

    /**
     * 列表查询
     */
    fun getCategoryList(pageNo: Int?, pagerSize: Int?, name: String?): PageResult<CategoryVo>

    /**
     * App端获取分类列表
     */
    fun getAppCategoryList(pageNo: Int?, pagerSize: Int?, name: String?): PageResult<CategoryVo>?

    /**
     * 删除分类
     */
    fun deleteCategroy(id: Long): Int
}
