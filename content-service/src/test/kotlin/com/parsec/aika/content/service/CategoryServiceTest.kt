package com.parsec.aika.content.service

import cn.hutool.core.lang.Assert
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManageCategoryReq
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource

@Rollback
@Transactional
@SpringBootTest
class CategoryServiceTest {

    @Resource
    private lateinit var categoryService: CategoryService


    private val user = LoginUserInfo().apply { userId = 1 }

    @Test
    fun testCategoryCRUD() {
        //测试添加分类
        val result = categoryService.saveCategory(
            com.parsec.aika.common.model.vo.req.ManageCategoryReq().apply {
                name = "测试分类"
            }, user
        )
        Assert.state(result!!.id != null)
        //测试添加重复分类
        try {
            categoryService.saveCategory(
                com.parsec.aika.common.model.vo.req.ManageCategoryReq().apply {
                    name = "测试分类"
                }, user
            )
            Assert.isFalse(true, "分类名称重复验证失败")
        } catch (e: Exception) {
            Assert.state(e.message == "Category name already exists")
        }
        //保存第二条数据
        val category2 = categoryService.saveCategory(
            com.parsec.aika.common.model.vo.req.ManageCategoryReq().apply {
                name = "测试分类2"
            }, user
        )
        Assert.state(category2!!.id != null)
        //测试更新分类
        val result1 = categoryService.updateCategory(
            com.parsec.aika.common.model.vo.req.ManageCategoryReq().apply {
                id = result.id
                name = "测试分类1"
                weight = 1
            }, user
        )
        Assert.state(result1 > 0)
        //修改分类
        try {
            categoryService.updateCategory(
                com.parsec.aika.common.model.vo.req.ManageCategoryReq().apply {
                    id = result.id
                    name = "测试分类2"
                }, user
            )
            Assert.isFalse(true, "修改分类名称，名称重复验证失败")
        } catch (e: Exception) {
            Assert.state(e.message == "Category name already exists")
        }
        //数量验证
        val pageResult = categoryService.getCategoryList(1, 10, "测试")
        Assert.state(pageResult.total == 2L)
        //删除分类
        val result2 = categoryService.deleteCategroy(result.id!!)
        Assert.state(result2 > 0)
        //数量验证
        val pageResult1 = categoryService.getCategoryList(1, 10, null)
        Assert.state(pageResult1.total == 1L)
    }


}
