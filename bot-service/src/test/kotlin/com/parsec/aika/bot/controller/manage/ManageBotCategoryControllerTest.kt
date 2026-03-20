package com.parsec.aika.bot.controller.manage

import com.baomidou.mybatisplus.extension.kotlin.KtQueryWrapper
import com.parsec.aika.bot.controller.manage.ManageBotCategoryController
import com.parsec.aika.bot.model.vo.req.ManageCategoryBotQueryVo
import com.parsec.aika.bot.model.vo.req.ManageCategoryCreateVo
import com.parsec.aika.bot.model.vo.req.ManageCategoryUpdateVo
import com.parsec.aika.common.mapper.CategoryMapper
import com.parsec.aika.common.model.em.BotSourceEnum
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.Category
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.PageVo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import javax.annotation.Resource

@SpringBootTest
internal class ManageBotCategoryControllerTest {

    @Resource
    private lateinit var manageBotCategoryController: ManageBotCategoryController

    @Resource
    private lateinit var categoryMapper: CategoryMapper

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_category_init.sql")
    fun botCategoryList() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 查询机器人的栏目列表
        val result = manageBotCategoryController.botCategoryList(PageVo(), loginUser)
        // 无其他模糊查询条件字段，故查询出所有未删除的栏目
        assertEquals(result.code, 0)
        assertTrue(result.data.list.size > 0)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_category_init.sql")
    fun categoryListTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 查询机器人的栏目列表
        val result = manageBotCategoryController.categoryList(PageVo(), loginUser)
        // 无其他模糊查询条件字段，故查询出所有未删除的栏目
        assertEquals(result.code, 0)
        assertTrue(result.data.list.size > 0)
        // 查询出了botCount、sortNo等其他字段
        println(result.data.list[0].botCount)
        // 查询出来的列表，是按照sortNo字段从小到大排序的
        assertTrue(result.data.list[0].sortNo!! < result.data.list[1].sortNo!!)
        assertTrue(result.data.list[0].tags!!.isNotEmpty())
        assertNotNull(result.data.list[0].cover)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_category_init.sql")
    fun botCategoryDetailTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入没有数据的栏目id，报错
        try {
            manageBotCategoryController.botCategoryDetail(11122212121, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该机器人栏目信息不存在")
        }
        // 传入有数据的栏目id
        val categoryId = 1000000L
        val result = manageBotCategoryController.botCategoryDetail(categoryId, loginUser)
        // 查询成功，且查询出来的数据id为传入的数据
        assertEquals(result.code, 0)
        assertEquals(result.data.categoryId, categoryId)
        assertNotNull(result.data.cover)
        assertEquals(2, result.data.tags!!.size)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_category_init.sql")
    fun botCategoryDeleteTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入没有数据的栏目id，报错
        try {
            manageBotCategoryController.botCategoryDelete(11122212121, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该机器人栏目信息不存在")
        }
        // 传入有数据的栏目id，但该栏目是内置分类，报错
        try {
            manageBotCategoryController.botCategoryDelete(1000000, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该栏目信息为内置分类不能删除")
        }
        // 传入存在数据的栏目id，内置分类字段为false，返回成功
        var result = manageBotCategoryController.botCategoryDelete(1000001, loginUser)
        assertEquals(result.code, 0)
        // 根据刚刚传入的栏目id（已经调用了删除方法），查询不到该数据
        var category = categoryMapper.selectById(1000001)
        assertNull(category)

        // 传入存在数据的栏目id，内置分类字段为NULL，返回成功
        result = manageBotCategoryController.botCategoryDelete(1000002, loginUser)
        assertEquals(result.code, 0)
        // 根据刚刚传入的栏目id（已经调用了删除方法），查询不到该数据
        category = categoryMapper.selectById(1000002)
        assertNull(category)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_category_init.sql")
    fun botCategoryCreateTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入空的栏目名称
        try {
            manageBotCategoryController.botCategoryCreate(ManageCategoryCreateVo(), loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "栏目名称不能为空")
        }
        // 传入已存在的栏目名称
        try {
            manageBotCategoryController.botCategoryCreate(ManageCategoryCreateVo().apply {
                      this.categoryName = "测试栏目0001"
            }, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该栏目名称已存在")
        }
        // 传入空的机器人id集合，保存成功，数据中的机器人总数为0
        var reqVo = ManageCategoryCreateVo().apply {
            this.categoryName = "测试栏目00067"
            this.botIds = mutableListOf()
        }
        var result = manageBotCategoryController.botCategoryCreate(reqVo, loginUser)
        assertEquals(result.code, 0)
        var categoryVo = categoryMapper.selectOne(KtQueryWrapper(Category::class.java).eq(Category::categoryName, reqVo.categoryName).last("limit 1"))
        assertEquals(categoryVo.botCount, 0)

        // 传入机器人id集合中的机器人id都不存在对应的机器人，保存成功，数据中的机器人总数为0
        var botIds = mutableListOf<Long>()
        botIds.add(132342)
        botIds.add(13234232434)
        reqVo = ManageCategoryCreateVo().apply {
            this.categoryName = "测试栏目0006asdf7"
            this.botIds = botIds
            this.tags = listOf()
        }
        result = manageBotCategoryController.botCategoryCreate(reqVo, loginUser)
        assertEquals(result.code, 0)
        categoryVo = categoryMapper.selectOne(KtQueryWrapper(Category::class.java).eq(Category::categoryName, reqVo.categoryName).last("limit 1"))
        assertEquals(categoryVo.botCount, 0)
        // 创建不包含tags的category
        assertEquals(categoryVo.tags?.size, 0)

        // 传入的机器人id集合中存在部分有对应的机器人，保存成功，数据中的机器人总数为对应机器人数量
        botIds = mutableListOf()
        botIds.add(13253324342)
        botIds.add(10000011)
        botIds.add(10000012)
        botIds.add(2435653245)
        reqVo = ManageCategoryCreateVo().apply {
            this.categoryName = "测试栏目0006as5555df7"
            this.botIds = botIds
            this.tags = listOf("tags1", "tags2")
            this.cover = "cover"
        }
        result = manageBotCategoryController.botCategoryCreate(reqVo, loginUser)
        assertEquals(result.code, 0)
        categoryVo = categoryMapper.selectOne(KtQueryWrapper(Category::class.java).eq(Category::categoryName, reqVo.categoryName).last("limit 1"))
        assertEquals(categoryVo.botCount, 2)
        // 创建包含tags的category
        assertEquals(categoryVo.tags, reqVo.tags)
        assertNotNull(categoryVo.cover)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_category_init.sql")
    fun botCategoryUpdateTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 传入空的栏目id
        try {
            manageBotCategoryController.botCategoryUpdate(ManageCategoryUpdateVo(), loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "栏目id不能为空")
        }
        // 传入空的栏目名称
        try {
            manageBotCategoryController.botCategoryUpdate(ManageCategoryUpdateVo().apply { this.categoryId = 11 }, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "栏目名称不能为空")
        }
        // 传入已存在的栏目名称(且id不是传入的id)
        try {
            manageBotCategoryController.botCategoryUpdate(ManageCategoryUpdateVo().apply {
                this.categoryId = 1000001
                this.categoryName = "测试栏目0001"
            }, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该栏目名称已存在")
        }

        // 传入空的机器人id集合，而该栏目原本对应有机器人，报错
        var reqVo = ManageCategoryUpdateVo().apply {
            this.categoryId = 1000000
            this.categoryName = "测试栏目0001"
            this.botIds = mutableListOf()
        }
        try {
            manageBotCategoryController.botCategoryUpdate(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The selected robot is incorrect.")
        }

        // 传入机器人id集合中的机器人id不为空，但对应的机器人数据 与传入的栏目id查询到的数据对应不上，报错
        var botIds = mutableListOf<Long>()
        botIds.add(132342)
        botIds.add(10000011)
        botIds.add(13234232434)
        reqVo = ManageCategoryUpdateVo().apply {
            this.categoryId = 1000000
            this.categoryName = "测试栏目0001"
            this.botIds = botIds
        }
        try {
            manageBotCategoryController.botCategoryUpdate(reqVo, loginUser)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The selected robots do not fully include the original data.")
        }

        // 传入的机器人id包含完原本对应的机器人（栏目名称为该栏目id对应的名称）
        botIds = mutableListOf()
        botIds.add(10000011)
        botIds.add(10000013)
        botIds.add(13234232434)
        reqVo = ManageCategoryUpdateVo().apply {
            this.categoryId = 1000000
            this.categoryName = "测试栏目0001"
            this.botIds = botIds
            this.sortNo = 11
            this.tags = listOf("tag1", "tag2")
        }
        var categoryVoBefore = categoryMapper.selectById(reqVo.categoryId)
        assertEquals(categoryVoBefore.categoryName, reqVo.categoryName)
        assertNotEquals(categoryVoBefore.sortNo, reqVo.sortNo)
        // 传入的机器人id集合包含完栏目id对应的机器人，能成功修改序号（栏目名称为该栏目id对应的名称）
        val result = manageBotCategoryController.botCategoryUpdate(reqVo, loginUser)
        assertEquals(result.code, 0)
        var categoryVoAfter = categoryMapper.selectById(reqVo.categoryId)
        assertEquals(categoryVoAfter.sortNo, reqVo.sortNo)
        // 更新tags，并验证一致性
        assertEquals(reqVo.tags, categoryVoAfter.tags)

        // 修改栏目名称
        reqVo = ManageCategoryUpdateVo().apply {
            this.categoryId = 1000000
            this.categoryName = "测试栏目0001234234"
            this.botIds = botIds
            this.sortNo = 17
            this.cover = "testcover"
        }
        categoryVoBefore = categoryMapper.selectById(reqVo.categoryId)
        assertNotEquals(categoryVoBefore.categoryName, reqVo.categoryName)
        assertNotEquals(categoryVoBefore.sortNo, reqVo.sortNo)
        // 传入的机器人id集合包含完栏目id对应的机器人，能成功修改序号（栏目名称为该栏目id对应的名称）
        manageBotCategoryController.botCategoryUpdate(reqVo, loginUser)
        categoryVoAfter = categoryMapper.selectById(reqVo.categoryId)
        assertEquals(categoryVoAfter.categoryName, reqVo.categoryName)
        assertEquals(categoryVoAfter.sortNo, reqVo.sortNo)
        // 非空tags更新为空tags
        assertEquals(0, categoryVoAfter.tags?.size)
        // 验证更新后的cover
        assertEquals(categoryVoAfter.cover, reqVo.cover)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_category_init.sql")
    fun botListTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }
        // 查询机器人列表
        val queryVo = ManageCategoryBotQueryVo()
        // 不传入查询条件
        var result = manageBotCategoryController.botList(queryVo, loginUser)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)

        // 传入机器人名称查询条件
        queryVo.botName = "001"
        // 查询出的数据中botName都包含传入的机器人名称
        result = manageBotCategoryController.botList(queryVo, loginUser)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        result.data.list.map {
            assertTrue(it.botName!!.contains(queryVo.botName!!))
        }

        // 传入机器人来源查询条件
        queryVo.botSource = BotSourceEnum.builtIn
        // 查询出的数据中botName都包含传入的机器人名称，且来源都为传入的机器人来源
        result = manageBotCategoryController.botList(queryVo, loginUser)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        result.data.list.map {
            assertTrue(it.botName!!.contains(queryVo.botName!!))
            assertEquals(it.botSource, queryVo.botSource)
        }



    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/manage_bot_category_init.sql")
    fun categoryCreateWithDuplicateTagsTest() {
        val loginUser = LoginUserInfo().apply {
            this.userId = 100
            this.userType = UserTypeEnum.ADMINUSER
        }

        // 传入重复的tags
        val reqVo = ManageCategoryCreateVo().apply {
            this.categoryName = "测试栏目0011"
            this.tags = listOf("tags1", "tags1", "tags2")
        }

        val result = manageBotCategoryController.botCategoryCreate(reqVo, loginUser)
        assertEquals(result.code, 0)

        // 查询数据，确保tags去重
        val categoryVo = categoryMapper.selectOne(KtQueryWrapper(Category::class.java).eq(Category::categoryName, reqVo.categoryName).last("limit 1"))
        assertEquals(categoryVo.tags?.size, 2)  // 需要去重后的tags数量
        assertTrue(categoryVo.tags!!.contains("tags1"))
        assertTrue(categoryVo.tags!!.contains("tags2"))
    }




}
