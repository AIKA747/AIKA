package com.parsec.aika.content.controller.manage

import com.parsec.aika.common.mapper.GiftMapper
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.Gift
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManageGiftCreateVo
import com.parsec.aika.common.model.vo.req.ManageGiftQueryVo
import com.parsec.aika.common.model.vo.req.ManageGiftUpdateVo
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource

@SpringBootTest
internal class ManageGiftControllerTest {

    @Resource
    private lateinit var giftController: ManageGiftController

    @Resource
    private lateinit var giftMapper: GiftMapper

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
    @Sql("/sql/gift_init.sql")
    fun getGiftListTest() {
        var queryVo = com.parsec.aika.common.model.vo.req.ManageGiftQueryVo()
        // 不传入查询条件
        // 没有传入storyId和chapterId，则筛选全局礼物列表。即查询出来的礼物，没有关联故事、章节
        var result = giftController.getGiftList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        result.data.list.map {
            assertNull(it.storyId)
            assertNull(it.chapterId)
        }
        // 传入查询条件storyId
        queryVo.storyId = 1000001
        result = giftController.getGiftList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 传入了故事id，则查询出来的是该故事下的故事礼物，章节id为空
        result.data.list.map {
            assertEquals(it.storyId, queryVo.storyId)
            assertNull(it.chapterId)
        }
        // 传入查询条件故事id、章节id
        queryVo.storyId = 1000001
        queryVo.chapterId = 1000002
        result = giftController.getGiftList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        // 传入了故事id，则查询出来的是该故事下的该章节下的礼物
        result.data.list.map {
            assertEquals(it.storyId, queryVo.storyId)
            assertEquals(it.chapterId, queryVo.chapterId)
        }

        // 传入查询条件礼物名称，未传入故事id、章节id，查询全局下包含该名称的
        queryVo = com.parsec.aika.common.model.vo.req.ManageGiftQueryVo()
        queryVo.giftName = "局"
        result = giftController.getGiftList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        result.data.list.map {
            assertNull(it.storyId)
            assertNull(it.chapterId)
            assertTrue(it.giftName!!.contains(queryVo.giftName!!))
        }
        // 传入查询条件礼物名称、故事id、章节id，查询该故事下包含该名称的故事级别礼物
        queryVo = com.parsec.aika.common.model.vo.req.ManageGiftQueryVo()
        queryVo.giftName = "事"
        queryVo.storyId = 1000001
        result = giftController.getGiftList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        result.data.list.map {
            assertEquals(it.storyId, queryVo.storyId)
            assertNull(it.chapterId)
            assertTrue(it.giftName!!.contains(queryVo.giftName!!))
        }
        // 传入查询条件礼物名称、故事id，未传入章节id，查询该故事下包含该名称的故事级别礼物
        queryVo = com.parsec.aika.common.model.vo.req.ManageGiftQueryVo()
        queryVo.giftName = "章"
        queryVo.storyId = 1000002
        queryVo.chapterId = 1000004
        result = giftController.getGiftList(queryVo, userInfo)
        assertEquals(result.code, 0)
        assertTrue(result.data.total > 0)
        result.data.list.map {
            assertEquals(it.storyId, queryVo.storyId)
            assertEquals(it.chapterId, queryVo.chapterId)
            assertTrue(it.giftName!!.contains(queryVo.giftName!!))
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/gift_init.sql")
    fun getGiftDetailTest() {
        // 传入不存在的id
        try {
            giftController.getGiftDetail(12132123, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该礼物信息不存在")
        }
        // 传入存在的id
        val giftId = 1000006L
        val result = giftController.getGiftDetail(giftId, userInfo)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/gift_init.sql")
    fun createGiftTest() {
        // 礼物名称已存在
        var createVo = com.parsec.aika.common.model.vo.req.ManageGiftCreateVo().apply {
            this.giftName = "全局礼物"
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
        }
        try {
            giftController.createGift(createVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该礼物名称已存在")
        }
        // 传入的故事id没有对应的数据
        createVo.giftName = "cesasdf"
        createVo.storyId = 2412341234
        try {
            giftController.createGift(createVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The story information does not exist")
        }
        // 传入的故事id有对应的数据，章节id没对应的数据
        createVo.storyId = 1000001
        createVo.chapterId = 2412341234
        try {
            giftController.createGift(createVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该章节信息不存在")
        }
        // 传入的故事id、章节id不是关联的
        createVo.storyId = 1000001
        createVo.chapterId = 1000005
        try {
            giftController.createGift(createVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "传入的故事id、章节id有误")
        }
        // 新增全局礼物
        createVo = com.parsec.aika.common.model.vo.req.ManageGiftCreateVo().apply {
            this.giftName = "asdfq23"
            this.friendDegree = 22
            this.storyDegree = 54
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
        }
        var result = giftController.createGift(createVo, userInfo)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
        // 通过接口返回的data（新增礼物的id值）查询得到刚刚新增的礼物数据
        var saveGiftVo = giftMapper.selectById(result.data)
        assertNotNull(saveGiftVo)
        assertEquals(saveGiftVo.giftName, createVo.giftName)
        assertEquals(saveGiftVo.image, createVo.image)
        assertNull(saveGiftVo.storyId)
        assertNull(saveGiftVo.chapterId)

        // 新增故事礼物
        createVo = com.parsec.aika.common.model.vo.req.ManageGiftCreateVo().apply {
            this.storyId = 1000001
            this.giftName = "asdfasd352434"
            this.friendDegree = 22
            this.storyDegree = 54
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
        }
        result = giftController.createGift(createVo, userInfo)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
        // 通过接口返回的data（新增礼物的id值）查询得到刚刚新增的礼物数据
        saveGiftVo = giftMapper.selectById(result.data)
        assertNotNull(saveGiftVo)
        assertEquals(saveGiftVo.giftName, createVo.giftName)
        assertEquals(saveGiftVo.image, createVo.image)
        assertEquals(saveGiftVo.storyId, createVo.storyId)
        assertNull(saveGiftVo.chapterId)

        // 新增章节礼物
        createVo = com.parsec.aika.common.model.vo.req.ManageGiftCreateVo().apply {
            this.storyId = 1000001
            this.chapterId = 1000002
            this.giftName = "dddd34"
            this.friendDegree = 22
            this.storyDegree = 54
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
        }
        result = giftController.createGift(createVo, userInfo)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
        // 通过接口返回的data（新增礼物的id值）查询得到刚刚新增的礼物数据
        saveGiftVo = giftMapper.selectById(result.data)
        assertNotNull(saveGiftVo)
        assertEquals(saveGiftVo.giftName, createVo.giftName)
        assertEquals(saveGiftVo.image, createVo.image)
        assertEquals(saveGiftVo.storyId, createVo.storyId)
        assertEquals(saveGiftVo.chapterId, createVo.chapterId)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/gift_init.sql")
    fun updateGiftTest() {
        // 传入不存在的id
        var updateVo = com.parsec.aika.common.model.vo.req.ManageGiftUpdateVo().apply {
            this.id = 122141231
            this.giftName = "sdfsss"
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
        }
        try {
            giftController.updateGift(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该礼物信息不存在")
        }
        // 传入的礼物名称已存在
        updateVo.id = 1000001
        updateVo.giftName = "测试0001"
        try {
            giftController.updateGift(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该礼物名称已存在")
        }
        // 传入的故事id没有对应的数据
        updateVo.giftName = "cesasdf"
        updateVo.storyId = 2412341234
        try {
            giftController.updateGift(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "The story information does not exist")
        }
        // 传入的故事id有对应的数据，章节id没对应的数据
        updateVo.storyId = 1000001
        updateVo.chapterId = 2412341234
        try {
            giftController.updateGift(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该章节信息不存在")
        }
        // 传入的故事id、章节id不是关联的
        updateVo.storyId = 1000001
        updateVo.chapterId = 1000005
        try {
            giftController.updateGift(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "传入的故事id、章节id有误")
        }
        // 修改全局礼物
        updateVo = com.parsec.aika.common.model.vo.req.ManageGiftUpdateVo().apply {
            this.id = 1000001
            this.giftName = "upd2121"
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
        }
        // 修改前的名称不等于传入的礼物名称
        var beforeVo = giftMapper.selectById(updateVo.id)
        assertNotEquals(beforeVo.giftName, updateVo.giftName)
        var result = giftController.updateGift(updateVo, userInfo)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
        // 修改后的名称为传入的礼物名称
        assertEquals(result.data.giftName, updateVo.giftName)

        // 修改故事礼物
        updateVo = com.parsec.aika.common.model.vo.req.ManageGiftUpdateVo().apply {
            this.id = 1000002
            this.storyId = 1000001
            this.giftName = "updstory2342"
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
        }
        // 修改前的名称不等于传入的礼物名称
        beforeVo = giftMapper.selectById(updateVo.id)
        assertNotEquals(beforeVo.giftName, updateVo.giftName)
        result = giftController.updateGift(updateVo, userInfo)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
        // 修改后的名称为传入的礼物名称
        assertEquals(result.data.giftName, updateVo.giftName)

        // 新增章节礼物
        updateVo = com.parsec.aika.common.model.vo.req.ManageGiftUpdateVo().apply {
            this.id = 1000006
            this.storyId = 1000002
            this.chapterId = 1000004
            this.giftName = "updchapta2342"
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
        }
        // 修改前的名称不等于传入的礼物名称
        beforeVo = giftMapper.selectById(updateVo.id)
        assertNotEquals(beforeVo.giftName, updateVo.giftName)
        result = giftController.updateGift(updateVo, userInfo)
        assertEquals(result.code, 0)
        assertNotNull(result.data)
        // 修改后的名称为传入的礼物名称
        assertEquals(result.data.giftName, updateVo.giftName)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/gift_init.sql")
    fun deleteGiftTest() {
        // 传入不存在的id
        try {
            giftController.deleteGift(12132123, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该礼物信息不存在")
        }
        // 传入能删除的id
        val giftId = 1000007L
        // 删除前，通过id能查询到对象信息
        val beforeVo = giftMapper.selectById(giftId)
        assertNotNull(beforeVo)
        val result = giftController.deleteGift(giftId, userInfo)
        assertEquals(result.code, 0)
        // 删除成功后，通过id无法查询到对象信息
        val afterVo = giftMapper.selectById(giftId)
        assertNull(afterVo)
    }
}
