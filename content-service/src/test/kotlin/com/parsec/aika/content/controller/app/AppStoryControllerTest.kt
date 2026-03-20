package com.parsec.aika.content.controller.app

import com.parsec.aika.common.model.em.Gender
import com.parsec.aika.common.model.vo.LoginUserInfo
import com.parsec.aika.content.model.vo.req.GetAppStoryReq
import com.parsec.aika.common.model.em.GameStatus
import com.parsec.aika.common.model.em.RecommendStrategy
import com.parsec.aika.content.service.StoryService
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional
import jakarta.annotation.Resource
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

@SpringBootTest
internal class AppStoryControllerTest {

    @Resource
    private lateinit var appStoryController: AppStoryController

    @Resource
    private lateinit var storyService: StoryService

    val loginUserInfo = LoginUserInfo().apply {
        this.userId = 10
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/init.sql")
    fun storyRecommend() {
        var resp = storyService.storyRecommend(10, listOf("rap","AI"), RecommendStrategy.popular)!!
        assertEquals("4", resp.storyId)
        resp = storyService.storyRecommend(11, listOf("rap","AI","篮球"), RecommendStrategy.balance)!!
        assertEquals("1", resp.storyId)
    }

//    @Test
//    @Rollback
//    @Transactional
//    @Sql("/sql/init.sql")
    fun testStoryFun() {
        // 列表
        val pageOne = appStoryController.getAppStory(
            GetAppStoryReq().apply { this.storyName = "白雪" },
            loginUserInfo
        ).data.list.last()
        assertEquals("白雪公主", pageOne.storyName)
        assertEquals(100, pageOne.rewardsScore)
        assertEquals(false, pageOne.locked)
        assertEquals(Gender.FEMALE, pageOne.gender)
        assertEquals("http://www.photo.com", pageOne.image)
        assertEquals("白雪公主和七个葫芦娃", pageOne.introduction)
        assertEquals("http://www.photo.com", pageOne.listCover)
        assertEquals(0.3, pageOne.storyProcess)
        assertEquals(GameStatus.PLAYING, pageOne.status)

        // 详情
        val story = appStoryController.getAppStoryId(pageOne.id!!, loginUserInfo).data
        assertEquals(pageOne.storyName, story.storyName)
        assertEquals(pageOne.rewardsScore, story.rewardsScore)
        assertEquals(50, story.cutoffScore)
        assertEquals(pageOne.gender, story.gender)
        assertEquals(pageOne.image, story.image)
        assertEquals(pageOne.introduction, story.introduction)
        assertEquals("http://www.photo.com", story.cover)
        assertEquals(pageOne.locked!!, story.unlocked)
        assertEquals(2, story.chapterId)
        assertEquals(pageOne.status, story.status)

        // 通过/失败信息
        val appStoryIdChapter = appStoryController.getAppStoryIdChapter(story.id!!, loginUserInfo).data
        assertEquals(2, appStoryIdChapter.id)
        assertEquals(1, appStoryIdChapter.storyId)
        assertEquals("白雪公主2", appStoryIdChapter.chapterName)
        assertEquals("http://www.photo.com", appStoryIdChapter.image)
        assertEquals("http://www.photo.com", appStoryIdChapter.picture)
        assertEquals("恭喜你1", appStoryIdChapter.copywriting)
        assertEquals(GameStatus.PLAYING, appStoryIdChapter.status)

        // 重新开始
//        val postAppStoryRecorderResp = appStoryController.postAppStoryRecorder(
//            PostAppStoryRecorderReq().apply { this.storyId = 1 },
//            loginUserInfo
//        ).data
//        assertEquals("白雪公主1", postAppStoryRecorderResp.chapterName)
//        assertEquals("http://www.photo.com", postAppStoryRecorderResp.image)
//        assertEquals("http://www.photo.com", postAppStoryRecorderResp.picture)
//        assertEquals("第一章", postAppStoryRecorderResp.copywriting)
//        assertEquals(GameStatus.NOT_STARTED, postAppStoryRecorderResp.status)
    }

    @Test
    @Rollback
    @Transactional
    @Sql("/sql/init.sql")
    fun testStoryCategoryId() {
        // 列表
        val pageList = appStoryController.getAppStory(
            GetAppStoryReq().apply { this.categoryId = "5" },
            loginUserInfo
        ).data.list
        assertEquals(1, pageList.size)

        // 列表
        val pageList1 = appStoryController.getAppStory(
            GetAppStoryReq().apply { this.categoryId = "3" },
            loginUserInfo
        ).data.list
        assertEquals(2, pageList1.size)

        // 列表
        val pageList2 = appStoryController.getAppStory(
            GetAppStoryReq().apply { this.categoryId = "999" },
            loginUserInfo
        ).data.list
        assertEquals(0, pageList2.size)

        // 非空category详情
        val storyCategory = appStoryController.getAppStoryId(1, loginUserInfo).data
        assertEquals(3, storyCategory.category!!.size)
        val cateNames = listOf("test1", "test2", "test3")
        var index = 0
        storyCategory.category!!.forEach {
            assertNotNull(it.id)
            assertEquals(cateNames[index],it.name)
            index ++
        }

        // 空category详情
        val storyNullCategory = appStoryController.getAppStoryId(4, loginUserInfo).data
        assertEquals(0, storyNullCategory.category?.size)
    }
}
