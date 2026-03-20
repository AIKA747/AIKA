package com.parsec.aika.content.service.impl

import cn.hutool.core.lang.Assert
import cn.hutool.core.util.StrUtil
import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.baomidou.mybatisplus.extension.plugins.pagination.Page
import com.parsec.aika.common.mapper.CategoryMapper
import com.parsec.aika.common.model.entity.Category
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManageCategoryReq
import com.parsec.aika.common.model.vo.resp.CategoryVo
import com.parsec.aika.common.util.PageUtil
import com.parsec.aika.content.service.CategoryService
import com.parsec.trantor.common.response.PageResult
import com.parsec.trantor.exception.core.BusinessException
import org.springframework.stereotype.Service
import jakarta.annotation.Resource

@Service
class CategoryServiceImpl : CategoryService {

    @Resource
    private lateinit var categoryMapper: CategoryMapper

    override fun saveCategory(req: ManageCategoryReq, user: LoginUserInfo): Category? {
        //验证名称不能重复
        this.checkCategoryName(req.name, req.id)
        val category = Category().apply {
            this.name = req.name
            this.weight = req.weight
            this.creator = user.userId
        }
        categoryMapper.insert(category)
        return category
    }

    override fun updateCategory(req: ManageCategoryReq, user: LoginUserInfo): Int {
        this.checkCategoryName(req.name, req.id)
        val category = categoryMapper.selectById(req.id) ?: throw BusinessException("Category not found")
        if (StrUtil.isNotBlank(req.name) && req.name != category.name) {
            category.name = req.name
        }
        if (null != req.weight && req.weight != category.weight) {
            category.weight = req.weight
        }
        category.updater = user.userId
        return categoryMapper.updateById(category)
    }

    override fun getCategoryList(pageNo: Int?, pagerSize: Int?, name: String?): PageResult<CategoryVo> {
        val page = Page<Category>(pageNo?.toLong() ?: 1, pagerSize?.toLong() ?: 10)
        val queryWrapper = KtQueryWrapper(Category::class.java)
            .select(Category::id, Category::name, Category::weight)
            .like(StrUtil.isNotBlank(name), Category::name, name)
            .orderByDesc(Category::createdAt)

        val pageResult = categoryMapper.selectPage(page, queryWrapper)
        val pageUtilResult = PageUtil<Category>().page(pageResult)

        val volist = pageUtilResult.list.map {
            CategoryVo().apply {
                this.id = it.id
                this.name = it.name
                this.weight = it.weight
            }
        }.toList()

        return PageResult<CategoryVo>().apply {
            this.list = volist
            this.total = pageUtilResult.total
            this.pageNum = pageUtilResult.pageNum
            this.pageSize = pageUtilResult.pageSize
            this.pages = pageUtilResult.pages
        }
    }

    override fun getAppCategoryList(pageNo: Int?, pagerSize: Int?, name: String?): PageResult<CategoryVo>? {
        val page = Page<Category>(pageNo?.toLong() ?: 1, pagerSize?.toLong() ?: 10)
        val queryWrapper = KtQueryWrapper(Category::class.java)
            .select(Category::id, Category::name, Category::weight)
            .like(StrUtil.isNotBlank(name), Category::name, name)
            .orderByDesc(Category::weight)
            .orderByAsc(Category::createdAt)

        val pageResult = categoryMapper.selectPage(page, queryWrapper)
        val pageUtilResult = PageUtil<Category>().page(pageResult)

        val volist = pageUtilResult.list.map {
            CategoryVo().apply {
                this.id = it.id
                this.name = it.name
            }
        }.toList()

        return PageResult<CategoryVo>().apply {
            this.list = volist
            this.total = pageUtilResult.total
            this.pageNum = pageUtilResult.pageNum
            this.pageSize = pageUtilResult.pageSize
            this.pages = pageUtilResult.pages
        }
    }

    override fun deleteCategroy(id: Long): Int {
        return categoryMapper.deleteById(id)
    }

    private fun checkCategoryName(name: String?, id: Long?) {
        val count = categoryMapper.selectCount(
            KtQueryWrapper(Category::class.java).eq(Category::name, name).ne(id != null, Category::id, id)
        )
        Assert.state(count <= 0, "Category name already exists")
    }
}
