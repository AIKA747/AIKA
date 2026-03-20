package com.parsec.aika.content.controller.manage

import com.parsec.aika.common.mapper.StoryChapterMapper
import com.parsec.aika.common.model.em.UserTypeEnum
import com.parsec.aika.common.model.entity.StoryChapterRule
import com.parsec.aika.common.model.entity.StoryChapterRules
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.common.model.vo.req.ManageChapterCreateVo
import com.parsec.aika.common.model.vo.req.ManageChapterUpdateOrderVo
import com.parsec.aika.common.model.vo.req.ManageChapterUpdateVo
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource

@SpringBootTest
internal class ManageChapterControllerTest {

    @Resource
    private lateinit var chapterController: ManageChapterController

    @Resource
    private lateinit var chapterMapper: StoryChapterMapper

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
    @Sql("/sql/story_chapter_init.sql")
    fun getChapterListTest() {
        var storyId = 1000001L
        var result = chapterController.getChapterList(storyId, userInfo)
        // 查询到的数据是该故事下对应章节信息
        result.data.map {
            assertEquals(it.storyId, storyId)
            // 查询出了该章节对应礼物信息
            assertNotNull(it.chapterGifts)
        }
        storyId = 1000002L
        result = chapterController.getChapterList(storyId, userInfo)
        // 查询到的数据是该故事下对应章节信息
        result.data.map {
            assertEquals(it.storyId, storyId)
            // 查询出了该章节对应礼物信息
            assertNotNull(it.chapterGifts)
        }
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_chapter_init.sql")
    fun getChapterDetailTest() {
        // 传入不存在的章节id
        try {
            chapterController.getChapterDetail(1211212121)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该章节信息不存在")
        }
        // 传入存在的章节id，会返回其对应的礼物信息
        val result = chapterController.getChapterDetail(1000002)
        assertEquals(result.code, 0)
        assertNotNull(result.data.chapterGifts)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_chapter_init.sql")
    fun createChapterTest() {
        val rules = mutableListOf<StoryChapterRules>()
        rules.add(StoryChapterRules().apply {
            this.key = "sdf"
            this.rule = StoryChapterRule().apply {
                this.friendDegree = 21
                this.question = "测试测试"
            }
        })
        val createVo = com.parsec.aika.common.model.vo.req.ManageChapterCreateVo().apply {
            this.chapterName = "cesfd"
            this.chapterOrder = 1
            this.chapterRule = rules
            this.chapterScore = 46
            this.cover = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.listCover = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.backgroundPrompt = "测试测试"
            this.introduction = "ces shuju"
            this.passedCopywriting = "恭喜你成功通关"
            this.passedPicture = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.storyId = 1000002
            this.personality = "个性化定制文案"
            this.tonePrompt = "加油哦"
            this.wordNumberPrompt = "short"
        }
        // 传入的故事id、章节名称、章节顺序。已存在
        try {
            createVo.storyId = 1000001
            createVo.chapterName = "章节1"
            createVo.chapterOrder = 1
            chapterController.createChapter(createVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该故事下已经存在该排序的该章节名称")
        }
        // 传入验证通过的信息
        createVo.storyId = 1000001
        createVo.chapterName = "章节4232"
        createVo.chapterOrder = 3
        val result = chapterController.createChapter(createVo, userInfo)
        assertEquals(result.code, 0)
        // 得到新增章节的id
        val chapterVo = chapterMapper.selectById(result.data)
        assertNotNull(chapterVo)
        assertEquals(chapterVo.storyId, createVo.storyId)
        assertEquals(chapterVo.chapterOrder, createVo.chapterOrder)
        assertEquals(chapterVo.chapterName, createVo.chapterName)
        assertEquals(chapterVo.chapterScore, createVo.chapterScore)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_chapter_init.sql")
    fun updateChapterTest() {
        val rules = mutableListOf<StoryChapterRules>()
        rules.add(StoryChapterRules().apply {
            this.key = "sdf"
            this.rule = StoryChapterRule().apply {
                this.friendDegree = 21
                this.question = "测试测试"
            }
        })
        val updateVo = com.parsec.aika.common.model.vo.req.ManageChapterUpdateVo().apply {
            this.chapterName = "cesfd"
            this.chapterOrder = 1
            this.chapterRule = rules
            this.chapterScore = 46
            this.cover = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.image = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.listCover = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.backgroundPrompt = "测试测试"
            this.introduction = "ces shuju"
            this.passedCopywriting = "恭喜你成功通关"
            this.passedPicture = "https://lmg.jj20.com/up/allimg/tp10/22022312542M617-0-lp.jpg"
            this.personality = "个性化定制文案"
            this.tonePrompt = "加油哦"
            this.wordNumberPrompt = "short"
        }
        // 传入不存在的id
        try {
            updateVo.id = 12132123
            chapterController.updateChapter(updateVo, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该章节信息不存在")
        }
        // 传入存在的id
        updateVo.id = 1000004
        val beforeVo = chapterMapper.selectById(updateVo.id)
        assertEquals(beforeVo.id, updateVo.id)
        assertNotEquals(beforeVo.chapterOrder, updateVo.chapterOrder)
        assertNotEquals(beforeVo.chapterName, updateVo.chapterName)
        assertNotEquals(beforeVo.personality, updateVo.personality)
        assertNotEquals(beforeVo.passedCopywriting, updateVo.passedCopywriting)
        val result = chapterController.updateChapter(updateVo, userInfo)
        assertEquals(result.code, 0)
        val afterVo = chapterMapper.selectById(updateVo.id)
        assertEquals(afterVo.id, updateVo.id)
        assertEquals(afterVo.chapterOrder, updateVo.chapterOrder)
        assertEquals(afterVo.chapterName, updateVo.chapterName)
        assertEquals(afterVo.personality, updateVo.personality)
        assertEquals(afterVo.passedCopywriting, updateVo.passedCopywriting)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_chapter_init.sql")
    fun updateChapterOrderTest() {
        val listVo = mutableListOf<com.parsec.aika.common.model.vo.req.ManageChapterUpdateOrderVo>()
        val updateOrderVo1 = com.parsec.aika.common.model.vo.req.ManageChapterUpdateOrderVo().apply {
            this.id = 1000001
            this.order = 2
        }
        listVo.add(updateOrderVo1)
        val updateOrderVo2 = com.parsec.aika.common.model.vo.req.ManageChapterUpdateOrderVo().apply {
            this.id = 1000002
            this.order = 1
        }
        listVo.add(updateOrderVo2)
        // 修改前，对应顺序不等
        val beforeVo1 = chapterMapper.selectById(updateOrderVo1.id)
        assertNotEquals(beforeVo1.chapterOrder, updateOrderVo1.order)
        val beforeVo2 = chapterMapper.selectById(updateOrderVo2.id)
        assertNotEquals(beforeVo2.chapterOrder, updateOrderVo2.order)
        // 调用修改顺序接口
        val result = chapterController.updateChapterOrder(listVo, userInfo)
        assertEquals(result.code, 0)
        // 修改后，对应顺序相等
        val afterVo1 = chapterMapper.selectById(updateOrderVo1.id)
        assertEquals(afterVo1.chapterOrder, updateOrderVo1.order)
        val afterVo2 = chapterMapper.selectById(updateOrderVo2.id)
        assertEquals(afterVo2.chapterOrder, updateOrderVo2.order)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/story_chapter_init.sql")
    fun deleteChapterTest() {
        // 章节采用硬删除，但是，需要查询游戏记录 StoryRecorder,如果有状态为 Playing 并且章节id为当前章节的，该章节不可删除。
        // 传入不存在的id
        try {
            chapterController.deleteChapter(12132123, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该章节信息不存在")
        }
        // 传入的章节id，对应在StoryRecorder有状态为 Playing 的数据
        try {
            chapterController.deleteChapter(1000001, userInfo)
            fail()
        } catch (e: Exception) {
            assertEquals(e.message, "该章节信息暂时不能删除")
        }
        // 传入能删除的章节id
        val chapterId = 1000007L
        val result = chapterController.deleteChapter(chapterId, userInfo)
        assertEquals(result.code, 0)
        // 由于是硬删除，通过sql无法查询到该数据
        val afterVo = chapterMapper.manageChapterCheckDelete(chapterId)
        assertNull(afterVo)
    }
}
