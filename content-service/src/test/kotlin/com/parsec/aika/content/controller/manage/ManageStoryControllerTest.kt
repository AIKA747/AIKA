package com.parsec.aika.content.controller.manage

import com.parsec.aika.common.mapper.StoryMapper
import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.em.StoryStatus
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.model.vo.req.ManageStoryCreateVo

import com.parsec.aika.content.model.vo.req.ManageStoryUpdateVo
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.test.web.servlet.MockMvc
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource

@SpringBootTest
@AutoConfigureMockMvc
internal class ManageStoryControllerTest {

    @Resource
    private lateinit var controller: ManageStoryController

    @Resource
    private lateinit var storyMapper: StoryMapper

    @Autowired
    private lateinit var mockMvc: MockMvc

    private val userInfo: LoginUserInfo = LoginUserInfo()

    @BeforeEach
    fun setUp() {
        userInfo.userId = 100
        userInfo.username = "管理员"
        userInfo.userType = UserTypeEnum.ADMINUSER
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun getStoryListTest() {
        val queryVo = com.parsec.aika.common.model.vo.req.ManageStoryQueryVo()
        var result = controller.getStoryList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 传入查询条件
        queryVo.storyName = "故事00"
        result = controller.getStoryList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 查询到的数据中的storyName都包含传入的名称
        result.data.list.map {
            assertTrue(it.storyName!!.contains(queryVo.storyName!!))
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun createStoryTest() {
        // 传入已存在的故事名称
        val createVo = ManageStoryCreateVo().apply {
            this.storyName = "测试故事666"
            this.rewardsScore = 87
            this.cutoffScore = 66
            this.gender = Gender.FEMALE
            this.defaultImage = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.introduction = "casfasdf"
            this.cover = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.listCover = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.failureCopywriting = "asdfasdf"
            this.failurePicture = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.categoryId = listOf(1,2)
        }
        try {
            controller.createStory(createVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The story name already exists")
        }
        createVo.storyName = "测试故事9988"
        val result = controller.createStory(createVo, userInfo)
        assertEquals(result.code, 0)
        // 返回的是新增故事的id，可通过id查询到对象
        val createStoryId = result.data
        val storyVo = storyMapper.selectById(createStoryId)
        assertEquals(storyVo.storyName, createVo.storyName)
        assertEquals(storyVo.rewardsScore, createVo.rewardsScore)
        assertEquals(storyVo.cutoffScore, createVo.cutoffScore)
        assertEquals(storyVo.gender, createVo.gender)
        assertEquals(storyVo.defaultImage, createVo.defaultImage)
        assertEquals(storyVo.introduction, createVo.introduction)
        assertEquals(storyVo.listCover, createVo.listCover)
        assertEquals(storyVo.failureCopywriting, createVo.failureCopywriting)
        assertEquals(storyVo.failurePicture, createVo.failurePicture)
        assertEquals(storyVo.categoryId!!.size, createVo.categoryId!!.size)

        createVo.categoryId = listOf(999)
        assertThrowsExactly(IllegalArgumentException::class.java) {
            // 异常：分类不存在
            controller.createStory(createVo, userInfo)
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun updateStoryTest() {
        val updateVo = ManageStoryUpdateVo().apply {
            this.storyName = "aads"
            this.rewardsScore = 87
            this.cutoffScore = 66
            this.gender = Gender.FEMALE
            this.defaultImage = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.introduction = "casfasdf"
            this.cover = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.listCover = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.failureCopywriting = "asdfasdf"
            this.failurePicture = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.status = StoryStatus.invalid
            this.categoryId = listOf(1,2,3)
        }
        // 传入不存在的id值
        updateVo.id = 10023332323
        try {
            controller.updateStory(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The story information does not exist")
        }
        // 传入存在的id值，但storyName已存在（除该id外）
        updateVo.id = 1000006
        updateVo.storyName = "测试故事0004"
        try {
            controller.updateStory(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The story name already exists")
        }
        // 传入该id值对应的storyName
        updateVo.storyName = "测试故事666"
        // 查询修改前的故事对象
        val beforeVo = storyMapper.selectById(updateVo.id)
        // 修改前的对象与传入的数据，只有故事名称一样
        assertEquals(beforeVo.storyName, updateVo.storyName)
        assertNotEquals(beforeVo.rewardsScore, updateVo.rewardsScore)
        assertNotEquals(beforeVo.cutoffScore, updateVo.cutoffScore)
        assertNotEquals(beforeVo.gender, updateVo.gender)
        assertNotEquals(beforeVo.defaultImage, updateVo.defaultImage)
        assertNotEquals(beforeVo.introduction, updateVo.introduction)
        assertNotEquals(beforeVo.listCover, updateVo.listCover)
        assertNotEquals(beforeVo.failureCopywriting, updateVo.failureCopywriting)
        assertNotEquals(beforeVo.failurePicture, updateVo.failurePicture)
        // 调用接口成功
        var result = controller.updateStory(updateVo, userInfo)
        assertEquals(result.code, 0)
        // 返回修改后的对象
        assertEquals(result.data.storyName, updateVo.storyName)
        assertEquals(result.data.rewardsScore, updateVo.rewardsScore)
        assertEquals(result.data.cutoffScore, updateVo.cutoffScore)
        assertEquals(result.data.gender, updateVo.gender)
        assertEquals(result.data.defaultImage, updateVo.defaultImage)
        assertEquals(result.data.introduction, updateVo.introduction)
        assertEquals(result.data.listCover, updateVo.listCover)
        assertEquals(result.data.failureCopywriting, updateVo.failureCopywriting)
        assertEquals(result.data.failurePicture, updateVo.failurePicture)
        assertTrue(result.data.categoryId!!.containsAll(updateVo.categoryId!!))

        // 修改故事名称
        updateVo.storyName = "测试故事asdf"
        result = controller.updateStory(updateVo, userInfo)
        assertEquals(result.code, 0)
        assertEquals(result.data.storyName, updateVo.storyName)
        assertNotEquals(result.data.storyName, beforeVo.storyName)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun deleteStoryTest() {
        // 传入不存在的id
        try {
            controller.deleteStory(124234123123, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The story information does not exist")
        }
        // 传入存在的id值。调用接口前能查询到对象
        val storyId = 1000002L
        val beforeVo = storyMapper.selectById(storyId)
        assertNotNull(beforeVo)
        val result = controller.deleteStory(storyId, userInfo)
        assertEquals(result.code, 0)
        // 调用删除接口成功后，无法查询到对象
        val afterVo = storyMapper.selectById(storyId)
        assertNull(afterVo)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun updateStoryStatusTest() {
        val vo = com.parsec.aika.common.model.vo.req.ManageStoryUpdateStatusVo().apply {
            this.status = StoryStatus.valid
        }
        // 传入不存在的id
        vo.id = 112121
        try {
            controller.updateStoryStatus(vo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The story information does not exist")
        }
        // 传入存在的id
        vo.id = 1000002L
        // 修改前的状态与传入的状态不同
        var beforeVo = storyMapper.selectById(vo.id)
        assertNotEquals(beforeVo.status, vo.status)
        // 调用设置状态接口
        var result = controller.updateStoryStatus(vo, userInfo)
        assertEquals(result.code, 0)
        // 修改后的状态与传入的状态相同
        var afterVo = storyMapper.selectById(vo.id)
        assertEquals(afterVo.status, vo.status)

        // 传入的状态与修改前的状态相同
        vo.id = 1000001L
        vo.status = StoryStatus.invalid
        beforeVo = storyMapper.selectById(vo.id)
        assertEquals(beforeVo.status, vo.status)
        // 调用设置状态接口
        result = controller.updateStoryStatus(vo, userInfo)
        assertEquals(result.code, 0)
        // 修改后的状态与传入的状态相同
        afterVo = storyMapper.selectById(vo.id)
        assertEquals(afterVo.status, vo.status)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun getStoryDetailTest() {
        // 传入不存在的id
        var id = 112121L
        try {
            controller.getStoryDetail(id, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The story information does not exist")
        }
        // 传入存在的id
        id = 1000001L
        val result = controller.getStoryDetail(id, userInfo)
        assertEquals(result.code, 0)
        val storyVo = storyMapper.selectById(id)
        assertEquals(storyVo.storyName, result.data.storyName)
        assertEquals(storyVo.rewardsScore, result.data.rewardsScore)
        assertEquals(storyVo.cutoffScore, result.data.cutoffScore)
        assertEquals(storyVo.gender, result.data.gender)
        assertEquals(storyVo.defaultImage, result.data.defaultImage)
        assertEquals(storyVo.introduction, result.data.introduction)
        assertEquals(storyVo.listCover, result.data.listCover)
        assertEquals(storyVo.failureCopywriting, result.data.failureCopywriting)
        assertEquals(storyVo.failurePicture, result.data.failurePicture)
        assertEquals(storyVo.status, result.data.status)
        assertEquals(storyVo.deleted, result.data.deleted)
        assertNotNull(result.data.dataVersion)
        assertNotNull(result.data.createdAt)
        assertNotNull(result.data.updatedAt)
        assertTrue(result.data.category!!.isNotEmpty())
        result.data.category!!.forEach { category ->
            assertTrue(category.id != null && category.name!!.isNotEmpty()) }

//
//        mockMvc.perform(MockMvcRequestBuilders.get("/manage/story/$id").principal(userInfo))
//            .andExpect(MockMvcResultMatchers.status().isOk).andExpect(
//                MockMvcResultMatchers.jsonPath("$.code").value("0"))
//            .andExpect(MockMvcResultMatchers.jsonPath("$.data.categoryId[0]").value("4"))


    }

    // 测试传入空的分类数组
    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun createStoryWithEmptyCategoryTest() {
        val createVo = ManageStoryCreateVo().apply {
            this.storyName = "测试故事9989"
            this.rewardsScore = 87
            this.cutoffScore = 66
            this.gender = Gender.FEMALE
            this.defaultImage = "https://example.com/image.jpg"
            this.introduction = "测试介绍"
            this.cover = "https://example.com/image.jpg"
            this.listCover = "https://example.com/image.jpg"
            this.failureCopywriting = "失败文案"
            this.failurePicture = "https://example.com/image.jpg"
            this.categoryId = emptyList() // 测试传入空的分类数组
        }

//        mockMvc.perform(
//            MockMvcRequestBuilders.post("/manage/story").contentType(MediaType.APPLICATION_JSON)
//                .content(JSONUtil.toJsonStr(createVo)).principal(userInfo as Principal))
//            .andExpect(MockMvcResultMatchers.status().isOk)
//            .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("400"))
//            .andExpect(MockMvcResultMatchers.jsonPath("$.msg").value(Matchers.containsString("category not empty")))
//

    }


    //测试传入了空了分类列表
    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun updateStoryWithEmptyCategoryTest() {
        val updateVo = ManageStoryUpdateVo().apply {
            this.storyName = "更新故事"
            this.rewardsScore = 87
            this.cutoffScore = 66
            this.gender = Gender.FEMALE
            this.defaultImage = "https://example.com/image.jpg"
            this.introduction = "更新后的故事介绍"
            this.cover = "https://example.com/image.jpg"
            this.listCover = "https://example.com/image.jpg"
            this.failureCopywriting = "更新后的失败文案"
            this.failurePicture = "https://example.com/image.jpg"
            this.categoryId = emptyList() // 测试更新时传入空的分类数组
        }
        assertThrowsExactly(IllegalArgumentException::class.java) {
            controller.updateStory(updateVo, userInfo)
        }
    }

    //测试传入重复的分类
    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun createStoryWithDuplicateCategoryTest() {
        val createVo = ManageStoryCreateVo().apply {
            this.storyName = "测试故事9990"
            this.rewardsScore = 87
            this.cutoffScore = 66
            this.gender = Gender.FEMALE
            this.defaultImage = "https://example.com/image.jpg"
            this.introduction = "测试介绍"
            this.cover = "https://example.com/image.jpg"
            this.listCover = "https://example.com/image.jpg"
            this.failureCopywriting = "失败文案"
            this.failurePicture = "https://example.com/image.jpg"
            this.categoryId = listOf(1, 1) // 测试传入重复的分类ID
        }
        assertThrowsExactly(IllegalArgumentException::class.java) {
            controller.createStory(createVo, userInfo)
        }
    }


    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_init.sql")
    fun updateStoryWithDuplicateCategoryTest() {
        val updateVo = ManageStoryUpdateVo().apply {
            this.storyName = "更新故事"
            this.rewardsScore = 87
            this.cutoffScore = 66
            this.gender = Gender.FEMALE
            this.defaultImage = "https://example.com/image.jpg"
            this.introduction = "更新后的故事介绍"
            this.cover = "https://example.com/image.jpg"
            this.listCover = "https://example.com/image.jpg"
            this.failureCopywriting = "更新后的失败文案"
            this.failurePicture = "https://example.com/image.jpg"
            this.categoryId = listOf(1, 1) // 测试更新时传入重复的分类ID
        }
        assertThrowsExactly(IllegalArgumentException::class.java) {
            controller.updateStory(updateVo, userInfo)
        }
    }
}
